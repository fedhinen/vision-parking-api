import { NextFunction, Request, Response } from "express"
import { rfidAssignmentService } from "../services/rfid-assignment.service"
import { rfidAssignmentSchema, updateRfidAssignmentSchema } from "../schemas/rfid-assignment.schema"
import { ZodError } from "zod"

const createRfidAssigment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = rfidAssignmentSchema.parse(req.body);
        const rfidAssignment = await rfidAssignmentService.createRfidAssigment(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Asignación RFID creada exitosamente",
            data: rfidAssignment
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

const getRfidAssignmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rfidAssignmentId } = req.params;
        const rfidAssignment = await rfidAssignmentService.getRfidAssignmentById(rfidAssignmentId);
        
        res.status(200).json({
            success: true,
            data: rfidAssignment
        });
    } catch (error) {
        next(error);
    }
}

const updateRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rfidAssignmentId } = req.params;
        const validatedData = updateRfidAssignmentSchema.parse(req.body);
        const rfidAssignment = await rfidAssignmentService.updateRfidAssigment(rfidAssignmentId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Asignación RFID actualizada exitosamente",
            data: rfidAssignment
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

const deleteRfidAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rfidAssignmentId } = req.params;
        await rfidAssignmentService.deleteRfidAssignment(rfidAssignmentId);
        
        res.status(200).json({
            success: true,
            message: "Asignación RFID eliminada exitosamente"
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