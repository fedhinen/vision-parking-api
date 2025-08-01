import { NextFunction, Request, Response } from "express"
import { reservationService } from "../services/reservation.service"
import { reservationSchema, updateReservationSchema } from "../schemas/reservation.schema"
import { ZodError } from "zod"
import { ValidationError } from "../middleware/error/error"

const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    const result = reservationSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = {
        ...result.data,
        rsv_initial_date: new Date(req.body.rsv_initial_date),
        rsv_end_date: new Date(req.body.rsv_end_date)
    };

    try {
        const reservation = await reservationService.createReservation(body);

        res.status(201).json({
            message: "Reservación creada exitosamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const getReservationById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const reservation = await reservationService.getReservationById(id);

        res.status(200).json({
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateReservationSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = {
        ...result.data,
        rsv_initial_date: new Date(req.body.rsv_initial_date),
        rsv_end_date: new Date(req.body.rsv_end_date)
    };

    try {
        const reservation = await reservationService.updateReservation(id, body);

        res.status(200).json({
            message: "Reservación actualizada exitosamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await reservationService.deleteReservation(id);

        res.status(200).json({
            message: "Reservación eliminada exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const reservationController = {
    createReservation,
    getReservationById,
    updateReservation,
    deleteReservation
}