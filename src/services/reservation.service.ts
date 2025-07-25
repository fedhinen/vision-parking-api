
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { reservationSchema, updateReservationSchema, ReservationSchema, UpdateReservationSchema } from "../schemas/reservation.schema";

const {
    LNG052,
    LNG051,
    LNG053,
    LNG054
} = ERROR_CATALOG.businessLogic

const createReservation = async (body: ReservationSchema) => {
    const validatedData = reservationSchema.parse(body);

    try {
        const newReservation = await prisma.reservations.create({
            data: {
                usr_id: validatedData.usr_id,
                pks_id: validatedData.pks_id,
                stu_id: validatedData.stu_id,
                rsv_initial_date: validatedData.rsv_initial_date,
                rsv_end_date: validatedData.rsv_end_date,
                rsv_reason: validatedData.rsv_reason,
                rsv_created_by: "system" // You might want to pass this as parameter
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
        return newReservation;
    } catch (error) {
        throw new InternalServerError(LNG051);
    }
}

const getReservationById = async (reservationId: string) => {
    try {
        const reservation = await prisma.reservations.findUnique({
            where: {
                rsv_id: reservationId
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

        if (!reservation) {
            throw new NotFoundError(LNG052);
        }

        return reservation;
    } catch (error) {
        throw error;
    }
}

const updateReservation = async (reservationId: string, body: UpdateReservationSchema) => {
    const validatedData = updateReservationSchema.parse(body);
    
    const reservation = await getReservationById(reservationId);

    try {
        const updatedReservation = await prisma.reservations.update({
            where: {
                rsv_id: reservation.rsv_id
            },
            data: validatedData,
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

        return updatedReservation;
    } catch (error) {
        throw new InternalServerError(LNG053);
    }
}

const deleteReservation = async (reservationId: string) => {
    const reservation = await getReservationById(reservationId);

    try {
        // For reservations, we might want to create a cancellation record
        // and then delete or mark as cancelled
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