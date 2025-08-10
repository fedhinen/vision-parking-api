
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { statusService } from "./status.service";
import { mqttService } from "./mqtt.service";
import { webSocketService } from "./websocket.service";
import { userService } from "./user.service";
import { parkingSpotService } from "./parking-spot.service";
import { parkingLotService } from "./parking-lot.service";

const {
    LNG052,
    LNG051,
    LNG054,
    LNG073,
    LNG074,
    LNG093,
    LNG094,
} = ERROR_CATALOG.businessLogic

const createReservation = async (body: any) => {
    const {
        usr_id,
        pks_id,
        rsv_initial_date,
        rsv_end_date,
        rsv_reason
    } = body;

    const parkingSpot = await parkingSpotService.getParkingSpotById(pks_id);

    const parkingLot = await parkingLotService.getParkingLotById(parkingSpot.pkl_id);

    const reservations = await getReservationsByUserId(usr_id);

    const existingReservation = reservations.filter(resv =>
        resv.status.stu_name === "Realizada"
        && resv.parking_spot.parking_lot.cmp_id === parkingLot.company.cmp_id
    )

    if (existingReservation.length > 0) {
        throw new InternalServerError(LNG094);
    }

    try {
        const statusReservation = await statusService.getStatusByTableAndName('reservations', 'Realizada');
        const statusParkingSpot = await statusService.getStatusByTableAndName('parking_spots', 'Reservado');

        const result = await prisma.$transaction(async (tx) => {
            const newReservation = await prisma.reservations.create({
                data: {
                    usr_id: usr_id,
                    pks_id: pks_id,
                    stu_id: statusReservation.stu_id,
                    rsv_initial_date: rsv_initial_date,
                    rsv_end_date: rsv_end_date,
                    rsv_reason: rsv_reason,
                    rsv_created_by: "system"
                },
                include: {
                    parking_spot: {
                        include: {
                            status: true
                        }
                    },
                    status: true
                }
            });

            await prisma.parking_spots.update({
                where: {
                    pks_id
                },
                data: {
                    stu_id: statusParkingSpot.stu_id,
                }
            })

            return newReservation
        })

        try {
            await mqttService.publishReservationCreated({
                rsv_id: result.rsv_id,
                usr_id: result.usr_id,
                pks_id: result.pks_id,
                status: result.status.stu_name,
            })
        } catch (mqttError) {
            console.error('Error al publicar mensaje MQTT:', mqttError)
        }

        try {
            webSocketService.broadcast({
                event: 'backend:new_reservation',
                data: {
                    pks_id: result.pks_id,
                    status: {
                        stu_name: result.status.stu_name
                    }
                },
                room: `pks_${result.pks_id}`
            })
        } catch (websocketError) {
            console.error('Error al enviar mensaje por WebSocket:', websocketError)
        }

        return result
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new InternalServerError(LNG051);
    }
}

const getReservationById = async (reservationId: string) => {
    try {
        const reservation = await prisma.reservations.findUnique({
            where: {
                rsv_id: reservationId
            }
        });

        if (!reservation) {
            throw new NotFoundError(LNG052);
        }

        return reservation;
    } catch (error) {
        throw error;
    }
}

const acceptReservation = async (reservationId: string) => {
    const reservation = await getReservationById(reservationId);

    const statusAccepted = await statusService.getStatusByTableAndName('reservations', 'Aceptada');

    const body = {
        stu_id: statusAccepted.stu_id
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const updatedReservation = await prisma.reservations.update({
                where: {
                    rsv_id: reservation.rsv_id
                },
                data: body,
                include: {
                    user: true,
                    parking_spot: true,
                    status: true
                }
            });

            const statusParkingSpot = await statusService.getStatusByTableAndName('parking_spots', 'Reservado');

            await tx.parking_spots.update({
                where: {
                    pks_id: updatedReservation.pks_id
                },
                data: {
                    stu_id: statusParkingSpot.stu_id,
                }
            })

            return updatedReservation
        })

        try {
            await mqttService.publishReservationStatusChanged({
                rsv_id: result.rsv_id,
                pks_id: result.pks_id, //parking spot id
                status: result.status.stu_name,
                action: 'accepted'
            })
        } catch (mqttError) {
            console.error('Error al publicar mensaje MQTT:', mqttError)
        }

        return result
    } catch (error) {
        throw new InternalServerError(LNG073)
    }
}

const rejectReservation = async (reservationId: string) => {
    const reservation = await getReservationById(reservationId);

    const statusRejected = await statusService.getStatusByTableAndName('reservations', 'Rechazada');

    const body = {
        stu_id: statusRejected.stu_id,
        rsv_active: false
    }

    try {
        const updatedReservation = await prisma.reservations.update({
            where: {
                rsv_id: reservation.rsv_id
            },
            data: body,
            include: {
                user: true,
                parking_spot: true,
                status: true
            }
        });

        try {
            await mqttService.publishReservationStatusChanged({
                rsv_id: updatedReservation.rsv_id,
                pks_id: updatedReservation.pks_id, //parking spot id
                status: updatedReservation.status.stu_name,
                action: 'rejected'
            })
        } catch (mqttError) {
            console.error('Error al publicar mensaje MQTT:', mqttError)
        }

        return updatedReservation;
    } catch (error) {
        throw new InternalServerError(LNG074);
    }
}

const deleteReservation = async (reservationId: string) => {
    const reservation = await getReservationById(reservationId);

    try {
        await prisma.reservations.delete({
            where: {
                rsv_id: reservation.rsv_id
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG054);
    }
}

const getReservationsByUserId = async (userId: string) => {
    const user = await userService.getUserById(userId);

    try {
        const reservations = await prisma.reservations.findMany({
            where: {
                usr_id: user.usr_id,

            },
            include: {
                status: {
                    select: {
                        stu_name: true
                    }
                },
                parking_spot: {
                    include: {
                        parking_lot: {
                            select: {
                                cmp_id: true
                            }
                        }
                    }
                }
            }
        })

        return reservations
    } catch (error) {
        throw new InternalServerError(LNG093)
    }
}

export const reservationService = {
    createReservation,
    getReservationById,
    acceptReservation,
    rejectReservation,
    deleteReservation,
    getReservationsByUserId
} 