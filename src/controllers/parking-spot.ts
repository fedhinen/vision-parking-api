import { NextFunction, Request, Response } from "express"
import { parkingSpotService } from "../services/parking-spot.service"
import { parkingSpotSchema, updateParkingSpotSchema } from "../schemas/parking-spot.schema"
import { ZodError } from "zod"
import { ValidationError } from "../middleware/error/error"

const createParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    const result = parkingSpotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingSpot = await parkingSpotService.createParkingSpot(body);

        res.status(201).json({
            message: "Cajón de estacionamiento creado exitosamente",
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const getParkingSpotById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const parkingSpot = await parkingSpotService.getParkingSpotById(id);

        res.status(200).json({
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const updateParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateParkingSpotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingSpot = await parkingSpotService.updateParkingSpot(id, body);

        res.status(200).json({
            message: "Cajón de estacionamiento actualizado exitosamente",
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const deleteParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await parkingSpotService.deleteParkingSpot(id);

        res.status(200).json({
            message: "Cajón de estacionamiento eliminado exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const parkingSpotController = {
    createParkingSpot,
    getParkingSpotById,
    updateParkingSpot,
    deleteParkingSpot
}