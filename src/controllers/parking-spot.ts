import { NextFunction, Request, Response } from "express"
import { parkingSpotService } from "../services/parking-spot.service"
import { parkingSpotSchema, updateParkingSpotSchema } from "../schemas/parking-spot.schema"
import { ZodError } from "zod"

const createParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = parkingSpotSchema.parse(req.body);
        const parkingSpot = await parkingSpotService.createParkingSpot(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Cajón de estacionamiento creado exitosamente",
            data: parkingSpot
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

const getParkingSpotById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingSpotId } = req.params;
        const parkingSpot = await parkingSpotService.getParkingSpotById(parkingSpotId);
        
        res.status(200).json({
            success: true,
            data: parkingSpot
        });
    } catch (error) {
        next(error);
    }
}

const updateParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingSpotId } = req.params;
        const validatedData = updateParkingSpotSchema.parse(req.body);
        const parkingSpot = await parkingSpotService.updateParkingSpot(parkingSpotId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Cajón de estacionamiento actualizado exitosamente",
            data: parkingSpot
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

const deleteParkingSpot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingSpotId } = req.params;
        await parkingSpotService.deleteParkingSpot(parkingSpotId);
        
        res.status(200).json({
            success: true,
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