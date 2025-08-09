import { NextFunction, Request, Response } from "express"
import { parkingLotService } from "../services/parking-lot.service"
import { parkingLotSchema, updateParkingLotSchema } from "../schemas/parking-lot.schema"
import { ValidationError } from "../middleware/error/error"

const getParkingLotsByCompanyId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const parkingLots = await parkingLotService.getParkingLotsByCompanyId(id);

        res.status(200).json(parkingLots);
    } catch (error) {
        next(error);
    }
}

const createParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const result = parkingLotSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingLot = await parkingLotService.createParkingLot(body);

        res.status(201).json({
            message: "Estacionamiento creado correctamente",
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
            message: "Estacionamiento encontrado correctamente",
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
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const parkingLot = await parkingLotService.updateParkingLot(id, body);

        res.status(200).json({
            message: "Estacionamiento actualizado correctamente",
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
            message: "Estacionamiento eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

export const parkingLotController = {
    getParkingLotsByCompanyId,
    createParkingLot,
    getParkingLotById,
    updateParkingLot,
    deleteParkingLot
}