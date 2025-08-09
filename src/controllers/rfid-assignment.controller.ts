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
        const { id } = req.params;
        const rfidAssignment = await rfidAssignmentService.getRfidAssignmentById(id);

        res.status(200).json({
            message: "Asignación RFID encontrada correctamente",
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const updateRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateRfidAssignmentSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const rfidAssignment = await rfidAssignmentService.updateRfidAssigment(id, body);

        res.status(200).json({
            message: "Asignación RFID actualizada correctamente",
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const deleteRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await rfidAssignmentService.deleteRfidAssignment(id);

        res.status(200).json({
            message: "Asignación RFID eliminada correctamente"
        });
    } catch (error) {
        next(error);
    }
}

const getRfidAssignmentsByCompanyId = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    try {
        const rfidAssignments = await rfidAssignmentService.getRfidAssignmentsByCompanyId(companyId);
        res.status(200).json(rfidAssignments);
    } catch (error) {
        next(error);
    }
}

export const rfidAssignmentController = {
    createRfidAssigment,
    getRfidAssignmentById,
    updateRfidAssignment,
    deleteRfidAssignment,
    getRfidAssignmentsByCompanyId
}