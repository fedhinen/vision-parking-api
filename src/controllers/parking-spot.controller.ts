import { NextFunction, Request, Response } from "express"
import { parkingSpotService } from "../services/parking-spot.service"
import { parkingSpotSchema, updateParkingSpotSchema } from "../schemas/parking-spot.schema"
import { ValidationError } from "../middleware/error/error"
import { parkingSpotConfigSchema } from "../schemas/parking-spot-config.schema"

const createParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'parking_spots';
    const result = parkingSpotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingSpot = await parkingSpotService.createParkingSpot(body);
        res.locals.newId = parkingSpot.pks_id;
        res.status(201).json({
            message: "Cajón de estacionamiento creado correctamente",
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
            message: "Cajón de estacionamiento encontrado correctamente",
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const updateParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'parking_spots';
    const { id } = req.params;

    const result = updateParkingSpotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingSpot = await parkingSpotService.updateParkingSpot(id, body);

        res.status(200).json({
            message: "Cajón de estacionamiento actualizado correctamente",
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const deleteParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'parking_spots';
    const { id } = req.params;

    try {
        await parkingSpotService.deleteParkingSpot(id);

        res.status(200).json({
            message: "Cajón de estacionamiento eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

const configParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.tableName = 'parking_spots';
    const { id } = req.params;

    const result = parkingSpotConfigSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const configSpot = await parkingSpotService.configParkingSpot(id, body);

        res.status(200).json({
            message: "Cajón de estacionamiento configurado correctamente",
            data: configSpot
        });
    } catch (error) {
        next(error);
    }
}

const getParkingSpotConfig = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const config = await parkingSpotService.getParkingSpotConfig(id);

        res.status(200).json(config);
    } catch (error) {
        next(error);
    }
}

export const parkingSpotController = {
    createParkingSpot,
    getParkingSpotById,
    updateParkingSpot,
    deleteParkingSpot,
    configParkingSpot,
    getParkingSpotConfig
}