import { NextFunction, Request, Response } from "express"
import { companyAccessRequestService } from "../services/company-access-request.service"
import { companyAccessRequestSchema, updateCompanyAccessRequestSchema } from "../schemas/company-access-request.schema"
import { ValidationError } from "../middleware/error/error"

const createCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const result = companyAccessRequestSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const companyAccessRequest = await companyAccessRequestService.createCompanyAccessRequest(body);

        res.status(201).json({
            message: "Solicitud de acceso creada correctamente",
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

const acceptCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const companyAccessRequest = await companyAccessRequestService.acceptCompanyAccessRequest(id);

        res.status(200).json({
            message: "Solicitud de acceso aceptada correctamente",
            data: companyAccessRequest
        });
    } catch (error) {
        next(error);
    }
}

const rejectCompanyAccessRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const companyAccessRequest = await companyAccessRequestService.rejectCompanyAccessRequest(id);

        res.status(200).json({
            message: "Solicitud de acceso rechazada correctamente",
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
            message: "Solicitud de acceso eliminada correctamente"
        });
    } catch (error) {
        next(error);
    }
}

export const companyAccessRequestController = {
    createCompanyAccessRequest,
    getCompanyAccessRequestById,
    acceptCompanyAccessRequest,
    rejectCompanyAccessRequest,
    deleteCompanyAccessRequest
}