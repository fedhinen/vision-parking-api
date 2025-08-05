import { NextFunction, Request, Response } from "express"
import { vehicleService } from "../services/vehicle.service"
import { vehicleSchema, updateVehicleSchema } from "../schemas/vehicle.schema"
import { ValidationError } from "../middleware/error/error"

const getCompanyVehicles = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    try {
        const vehicles = await vehicleService.getCompanyVehicles(companyId);

        res.status(200).json({
            message: "Vehículos encontrados correctamente",
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
}

const getUserVehicles = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const vehicles = await vehicleService.getUserVehicles(id);

        res.status(200).json({
            message: "Vehículos encontrados correctamente",
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
}

const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    const result = vehicleSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = {
        ...result.data,
        usr_id: req.body.usr_id
    };

    try {
        const vehicle = await vehicleService.createVehicle(body);

        res.status(201).json({
            message: "Vehículo creado correctamente",
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const vehicle = await vehicleService.getVehicleById(id);

        res.status(200).json({
            message: "Vehículo encontrado correctamente",
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateVehicleSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data

    try {

        const vehicle = await vehicleService.updateVehicle(id, body);

        res.status(200).json({
            message: "Vehículo actualizado correctamente",
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await vehicleService.deleteVehicle(id);

        res.status(200).json({
            message: "Vehículo eliminado correctamente"
        });
    } catch (error) {
        next(error);
    }
}

export const vehicleController = {
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getCompanyVehicles,
    getUserVehicles
}