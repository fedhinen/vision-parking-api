import { NextFunction, Request, Response } from "express"
import { parkingLotService } from "../services/parking-lot.service"
import { parkingLotSchema, updateParkingLotSchema } from "../schemas/parking-lot.schema"
import { ZodError } from "zod"

const createParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = parkingLotSchema.parse(req.body);
        const parkingLot = await parkingLotService.createParkingLot(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Estacionamiento creado exitosamente",
            data: parkingLot
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

const getParkingLotById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingLotId } = req.params;
        const parkingLot = await parkingLotService.getParkingLotById(parkingLotId);
        
        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
}

const updateParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingLotId } = req.params;
        const validatedData = updateParkingLotSchema.parse(req.body);
        const parkingLot = await parkingLotService.updateParkingLot(parkingLotId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Estacionamiento actualizado exitosamente",
            data: parkingLot
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

const deleteParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parkingLotId } = req.params;
        await parkingLotService.deleteParkingLot(parkingLotId);
        
        res.status(200).json({
            success: true,
            message: "Estacionamiento eliminado exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const parkingLotController = {
    createParkingLot,
    getParkingLotById,
    updateParkingLot,
    deleteParkingLot
}