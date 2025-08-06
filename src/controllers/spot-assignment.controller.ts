import { NextFunction, Request, Response } from "express"
import { spotAssignmentService } from "../services/spot-assignment.service"
import { spotAssignmentSchema, updateSpotAssignmentSchema } from "../schemas/spot-assignment.schema"
import { ValidationError } from "../middleware/error/error"

const createSpotAssigment = async (req: Request, res: Response, next: NextFunction) => {
    const result = spotAssignmentSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data

    try {
        const spotAssignment = await spotAssignmentService.createSpotAssigment(body);

        res.status(201).json({
            message: "Asignación de cajón creada correctamente",
            data: spotAssignment
        });
    } catch (error) {
        next(error);
    }
}

const getSpotAssignmentById = async (req: Request, res: Response, next: NextFunction) => {
    const { spotAssignmentId } = req.params;

    try {
        const spotAssignment = await spotAssignmentService.getSpotAssignmentById(spotAssignmentId);

        res.status(200).json({
            data: spotAssignment
        });
    } catch (error) {
        next(error);
    }
}

const updateSpotAssigment = async (req: Request, res: Response, next: NextFunction) => {
    const { spotAssignmentId } = req.params;

    const result = updateSpotAssignmentSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const spotAssignment = await spotAssignmentService.updateSpotAssigment(spotAssignmentId, body);

        res.status(200).json({
            message: "Asignación de cajón actualizada correctamente",
            data: spotAssignment
        });
    } catch (error) {
        next(error);
    }
}

const deleteSpotAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { spotAssignmentId } = req.params;

    try {
        await spotAssignmentService.deleteSpotAssignment(spotAssignmentId);

        res.status(200).json({
            message: "Asignación de cajón eliminada correctamente"
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