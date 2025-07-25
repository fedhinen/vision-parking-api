import { NextFunction, Request, Response } from "express"
import { companyAccessRequestService } from "../services/company-access-request.service"
import { companyAccessRequestSchema, updateCompanyAccessRequestSchema } from "../schemas/company-access-request.schema"
import { ZodError } from "zod"

const createCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = companyAccessRequestSchema.parse(req.body);
        const companyAccessRequest = await companyAccessRequestService.createCompanyAccessRequest(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Solicitud de acceso creada exitosamente",
            data: companyAccessRequest
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

const getCompanyAccessRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyAccessRequestId } = req.params;
        const companyAccessRequest = await companyAccessRequestService.getCompanyAccessRequestById(companyAccessRequestId);
        
        res.status(200).json({
            success: true,
            data: companyAccessRequest
        });
    } catch (error) {
        next(error);
    }
}

const updateCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyAccessRequestId } = req.params;
        const validatedData = updateCompanyAccessRequestSchema.parse(req.body);
        const companyAccessRequest = await companyAccessRequestService.updateCompanyAccessRequest(companyAccessRequestId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Solicitud de acceso actualizada exitosamente",
            data: companyAccessRequest
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

const deleteCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyAccessRequestId } = req.params;
        await companyAccessRequestService.deleteCompanyAccessRequest(companyAccessRequestId);
        
        res.status(200).json({
            success: true,
            message: "Solicitud de acceso eliminada exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const companyAccessRequestController = {
    createCompanyAccessRequest,
    getCompanyAccessRequestById,
    updateCompanyAccessRequest,
    deleteCompanyAccessRequest
}