import { NextFunction, Request, Response } from "express"
import { reservationService } from "../services/reservation.service"
import { reservationSchema, updateReservationSchema } from "../schemas/reservation.schema"
import { ValidationError } from "../middleware/error/error"

const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'reservations';
    const requestBody = {
        ...req.body,
        rsv_initial_date: new Date(req.body.rsv_initial_date),
        rsv_end_date: new Date(req.body.rsv_end_date)
    }

    const result = reservationSchema.safeParse(requestBody);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data

    try {
        const reservation = await reservationService.createReservation(body);
        res.locals.newId = reservation.rsv_id;
        res.status(201).json({
            message: "Reservación creada correctamente",
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
            message: "Reservación encontrada correctamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'reservations';
    const { id } = req.params;

    const requestBody = {
        ...req.body,
        rsv_initial_date: req.body.rsv_initial_date ? new Date(req.body.rsv_initial_date) : undefined,
        rsv_end_date: req.body.rsv_end_date ? new Date(req.body.rsv_end_date) : undefined
    }

    const result = updateReservationSchema.safeParse(requestBody);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data

    try {
        const reservation = await reservationService.updateReservation(id, body);

        res.status(200).json({
            message: "Reservación actualizada correctamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'reservations';
    const { id } = req.params;

    try {
        await reservationService.deleteReservation(id);

        res.status(200).json({
            message: "Reservación eliminada correctamente"
        });
    } catch (error) {
        next(error);
    }
}

const getReservationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const reservations = await reservationService.getReservationsByUserId(id);

        res.status(200).json({
            message: "Reservaciones obtenidas correctamente",
            data: reservations
        });
    } catch (error) {
        next(error);
    }
}

export const reservationController = {
    createReservation,
    getReservationById,
    updateReservation,
    deleteReservation,
    getReservationsByUserId
}