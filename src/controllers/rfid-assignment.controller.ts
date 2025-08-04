import { NextFunction, Request, Response } from "express"
import { rfidAssignmentService } from "../services/rfid-assignment.service"
import { rfidAssignmentSchema, updateRfidAssignmentSchema } from "../schemas/rfid-assignment.schema"
import { ValidationError } from "../middleware/error/error"

const createRfidAssigment = async (req: Request, res: Response, next: NextFunction) => {
    const result = rfidAssignmentSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const rfidAssignment = await rfidAssignmentService.createRfidAssigment(body);

        res.status(201).json({
            message: "Asignación RFID creada correctamente",
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const getRfidAssignmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rfidAssignmentId } = req.params;
        const rfidAssignment = await rfidAssignmentService.getRfidAssignmentById(rfidAssignmentId);

        res.status(200).json({
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const updateRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { rfidAssignmentId } = req.params;

    const result = updateRfidAssignmentSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const rfidAssignment = await rfidAssignmentService.updateRfidAssigment(rfidAssignmentId, body);

        res.status(200).json({
            message: "Asignación RFID actualizada correctamente",
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const deleteRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { rfidAssignmentId } = req.params;

    try {
        await rfidAssignmentService.deleteRfidAssignment(rfidAssignmentId);

        res.status(200).json({
            message: "Asignación RFID eliminada correctamente"
        });
    } catch (error) {
        next(error);
    }
}

export const rfidAssignmentController = {
    createRfidAssigment,
    getRfidAssignmentById,
    updateRfidAssignment,
    deleteRfidAssignment
}