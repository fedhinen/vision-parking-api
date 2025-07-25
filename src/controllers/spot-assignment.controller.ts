import { NextFunction, Request, Response } from "express"
import { spotAssignmentService } from "../services/spot-assignment.service"
import { spotAssignmentSchema, updateSpotAssignmentSchema } from "../schemas/spot-assignment.schema"
import { ZodError } from "zod"

const createSpotAssigment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = spotAssignmentSchema.parse(req.body);
        const spotAssignment = await spotAssignmentService.createSpotAssigment(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Asignación de cajón creada exitosamente",
            data: spotAssignment
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

const getSpotAssignmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { spotAssignmentId } = req.params;
        const spotAssignment = await spotAssignmentService.getSpotAssignmentById(spotAssignmentId);
        
        res.status(200).json({
            success: true,
            data: spotAssignment
        });
    } catch (error) {
        next(error);
    }
}

const updateSpotAssigment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { spotAssignmentId } = req.params;
        const validatedData = updateSpotAssignmentSchema.parse(req.body);
        const spotAssignment = await spotAssignmentService.updateSpotAssigment(spotAssignmentId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Asignación de cajón actualizada exitosamente",
            data: spotAssignment
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

const deleteSpotAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { spotAssignmentId } = req.params;
        await spotAssignmentService.deleteSpotAssignment(spotAssignmentId);
        
        res.status(200).json({
            success: true,
            message: "Asignación de cajón eliminada exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const spotAssignmentController = {
    createSpotAssigment,
    getSpotAssignmentById,
    updateSpotAssigment,
    deleteSpotAssignment
}