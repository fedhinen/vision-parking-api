import { NextFunction, Request, Response } from "express"
import { parkingLotService } from "../services/parking-lot.service"
import { parkingLotSchema, updateParkingLotSchema } from "../schemas/parking-lot.schema"
import { ZodError } from "zod"

const createParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const result = parkingLotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const parkingLot = await parkingLotService.createParkingLot(body);

        res.status(201).json({
            message: "Estacionamiento creado exitosamente",
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
}

const getParkingLotById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const parkingLot = await parkingLotService.getParkingLotById(id);

        res.status(200).json({
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
}

const updateParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateParkingLotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const parkingLot = await parkingLotService.updateParkingLot(id, body);

        res.status(200).json({
            message: "Estacionamiento actualizado exitosamente",
            data: parkingLot
        });
    } catch (error) {
        next(error);
    }
}

const deleteParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await parkingLotService.deleteParkingLot(id);

        res.status(200).json({
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