
import { prisma } from "../utils/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { statusService } from "./status.service";
import { mqttService } from "./mqtt.service";
import { webSocketService } from "./websocket.service";
import { userService } from "./user.service";
import { parkingSpotService } from "./parking-spot.service";
import { parkingLotService } from "./parking-lot.service";
import { rfidTagService } from "./rfid-tag.service";
import { rfidAssignmentService } from "./rfid-assignment.service";

const {
    LNG052,
    LNG051,
    LNG054,
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

    const userTag = await rfidAssignmentService.getRfidAssignmentByUserId(usr_id);

    const existingReservation = reservations.filter(resv =>
        resv.status.stu_name === "Realizada"
        && resv.parking_spot.parking_lot.cmp_id === parkingLot.company.cmp_id
    )

    if (existingReservation.length > 0) {
        throw new ConflictError(LNG094);
    }

    try {
        const statusReservation = await statusService.getStatusByTableAndName('reservations', 'Realizada');
        const statusParkingSpot = await statusService.getStatusByTableAndName('parking_spots', 'Reservado');

        const { newReservation, updatedParkingSpot } = await prisma.$transaction(async (tx) => {
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

            const updatedParkingSpot = await prisma.parking_spots.update({
                where: {
                    pks_id
                },
                data: {
                    stu_id: statusParkingSpot.stu_id,
                },
                include: {
                    status: {
                        select: {
                            stu_name: true
                        }
                    }
                }
            })

            await prisma.spot_assignments.create({
                data: {
                    pks_id: pks_id,
                    usr_id: usr_id,
                    spa_created_by: "system"
                }
            })

            return { newReservation, updatedParkingSpot };
        })

        const parkingSpotConfig = await prisma.parking_spots_config.findFirst({
            where: {
                pks_id: parkingSpot.pks_id,
                psc_active: true
            }
        })

        try {
            await mqttService.publishReservationCreated({
                rsv_id: newReservation.rsv_id,
                usr_id: newReservation.usr_id,
                pks_id: newReservation.pks_id,
                status: newReservation.status.stu_name,
                esp32_id: parkingSpotConfig?.esp32_id!,
                tagIdentifier: userTag.rfid_tag.rft_tag
            })
        } catch (mqttError) {
            console.error('Error al publicar mensaje MQTT:', mqttError)
        }

        const spotId = newReservation.parking_spot.pks_id

        const baseEvent = 'backend:new_reservation';

        const eventName = `${baseEvent}:${spotId}`;

        try {
            webSocketService.broadcast({
                event: eventName,
                data: {
                    pks_id: spotId,
                    status: {
                        stu_name: updatedParkingSpot.status.stu_name
                    }
                },
                room: `pks_${spotId}`
            })
        } catch (websocketError) {
            console.error('Error al enviar mensaje por WebSocket:', websocketError)
        }

        return newReservation
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

const updateReservation = async (reservationId: string, body: any) => {
    const reservation = await getReservationById(reservationId);

    try {
        const updatedReservation = await prisma.reservations.update({
            where: {
                rsv_id: reservation.rsv_id
            },
            data: body
        });

        return updatedReservation;
    } catch (error) {
        throw new InternalServerError(LNG054);
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
    updateReservation,
    deleteReservation,
    getReservationsByUserId
} 