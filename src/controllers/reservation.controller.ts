import { NextFunction, Request, Response } from "express"
import { reservationService } from "../services/reservation.service"
import { reservationSchema, updateReservationSchema } from "../schemas/reservation.schema"
import { ZodError } from "zod"

const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Convert date strings to Date objects
        const bodyData = {
            ...req.body,
            rsv_initial_date: new Date(req.body.rsv_initial_date),
            rsv_end_date: new Date(req.body.rsv_end_date)
        };
        
        const validatedData = reservationSchema.parse(bodyData);
        const reservation = await reservationService.createReservation(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Reserva creada exitosamente",
            data: reservation
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Datos de entrada inválidos",
                errors: error.issues
            });
        }
        next(error);
    }
}

const getReservationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reservationId } = req.params;
        const reservation = await reservationService.getReservationById(reservationId);
        
        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

const updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reservationId } = req.params;
        
        // Convert date strings to Date objects if present
        const bodyData = { ...req.body };
        if (bodyData.rsv_initial_date) {
            bodyData.rsv_initial_date = new Date(bodyData.rsv_initial_date);
        }
        if (bodyData.rsv_end_date) {
            bodyData.rsv_end_date = new Date(bodyData.rsv_end_date);
        }
        
        const validatedData = updateReservationSchema.parse(bodyData);
        const reservation = await reservationService.updateReservation(reservationId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Reserva actualizada exitosamente",
            data: reservation
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Datos de entrada inválidos",
                errors: error.issues
            });
        }
        next(error);
    }
}

const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reservationId } = req.params;
        await reservationService.deleteReservation(reservationId);
        
        res.status(200).json({
            success: true,
            message: "Reserva eliminada exitosamente"
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