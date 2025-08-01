import { NextFunction, Request, Response } from "express"
import { companyAccessRequestService } from "../services/company-access-request.service"
import { companyAccessRequestSchema, updateCompanyAccessRequestSchema } from "../schemas/company-access-request.schema"
import { ZodError } from "zod"

const createCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const result = companyAccessRequestSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const companyAccessRequest = await companyAccessRequestService.createCompanyAccessRequest(body);

        res.status(201).json({
            message: "Solicitud de acceso creada exitosamente",
            data: companyAccessRequest
        });
    } catch (error) {
        next(error);
    }
}

const getCompanyAccessRequestById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const companyAccessRequest = await companyAccessRequestService.getCompanyAccessRequestById(id);

        res.status(200).json({
            data: companyAccessRequest
        });
    } catch (error) {
        next(error);
    }
}

const updateCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateCompanyAccessRequestSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const companyAccessRequest = await companyAccessRequestService.updateCompanyAccessRequest(id, body);

        res.status(200).json({
            message: "Solicitud de acceso actualizada exitosamente",
            data: companyAccessRequest
        });
    } catch (error) {
        next(error);
    }
}

const deleteCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await companyAccessRequestService.deleteCompanyAccessRequest(id);

        res.status(200).json({
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