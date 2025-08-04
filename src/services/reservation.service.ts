
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { statusService } from "./status.service";

const {
    LNG052,
    LNG051,
    LNG053,
    LNG054
} = ERROR_CATALOG.businessLogic

const createReservation = async (body: any) => {
    const {
        usr_id,
        pks_id,
        stu_id,
        rsv_initial_date,
        rsv_end_date,
        rsv_reason
    } = body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const newReservation = await prisma.reservations.create({
                data: {
                    usr_id: usr_id,
                    pks_id: pks_id,
                    stu_id: stu_id,
                    rsv_initial_date: rsv_initial_date,
                    rsv_end_date: rsv_end_date,
                    rsv_reason: rsv_reason,
                    rsv_created_by: "system"
                },
                include: {
                    user: true,
                    parking_spot: {
                        include: {
                            status: true
                        }
                    },
                    status: true
                }
            });

            const status = await statusService.getStatusByTableAndName('parking_spots', 'Reservado');

            await tx.parking_spots.update({
                where: {
                    pks_id: newReservation.pks_id
                },
                data: {
                    stu_id: status.stu_id,
                }
            })

            return newReservation
        })

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
        throw new InternalServerError(LNG053);
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

export const reservationService = {
    createReservation,
    getReservationById,
    updateReservation,
    deleteReservation
} 