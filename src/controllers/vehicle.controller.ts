import { NextFunction, Request, Response } from "express"
import { vehicleService } from "../services/vehicle.service"
import { vehicleSchema, updateVehicleSchema } from "../schemas/vehicle.schema"
import { ZodError } from "zod"

const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = vehicleSchema.parse(req.body);
        const vehicle = await vehicleService.createVehicle(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Vehículo creado exitosamente",
            data: vehicle
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

const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await vehicleService.getVehicleById(vehicleId);
        
        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        const validatedData = updateVehicleSchema.parse(req.body);
        const vehicle = await vehicleService.updateVehicle(vehicleId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Vehículo actualizado exitosamente",
            data: vehicle
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

const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        await vehicleService.deleteVehicle(vehicleId);
        
        res.status(200).json({
            success: true,
            message: "Vehículo eliminado exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const vehicleController = {
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}