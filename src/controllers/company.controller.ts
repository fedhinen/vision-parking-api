import { NextFunction, Request, Response } from "express";
import { companySchema } from "../schemas/company.schema";
import { ValidationError } from "../middleware/error/error";
import { companyService } from "../services/company.service";
import { logger } from "../utils/logger";
import { USER_ACTIONS } from "../utils/consts";

const getCompanies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await companyService.getCompanies();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
}

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    let log_field_id: string | undefined = undefined;
    let response: any = undefined;
    const result = companySchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const newCompany = await companyService.createCompany(body)
        log_field_id = newCompany.cmp_id;
        response = newCompany
        res.status(201).json(newCompany)
    } catch (error) {
        next(error)
    } finally {
        const loggerBody = {
            log_table_name: "companies",
            log_field_id,
            log_body: req.body,
            log_action: USER_ACTIONS.CREACION,
            log_response: response,
            log_created_by: req.user?.usr_name
        }

        logger(loggerBody)
    }
}

const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const company = await companyService.getCompanyById(id)
        res.status(200).json(company)
    } catch (error) {
        next(error)
    }
}

const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    let log_field_id: string | undefined = undefined;
    let response: any = undefined;

    const { id } = req.params
    const result = companySchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const updatedCompany = await companyService.updateCompany(id, body)
        log_field_id = updatedCompany.cmp_id;
        response = updatedCompany
        res.status(200).json(updatedCompany)
    } catch (error) {
        next(error)
    } finally {
        const loggerBody = {
            log_table_name: "companies",
            log_field_id,
            log_body: req.body,
            log_action: USER_ACTIONS.ACTUALIZACION,
            log_response: response,
            log_created_by: req.user?.usr_name
        }

        logger(loggerBody)
    }
}

const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    let log_field_id: string | undefined = undefined;
    let response: any = undefined;

    const { id } = req.params

    try {
        await companyService.deleteCompany(id)
        res.status(204).json({
            message: "Compañia eliminada correctamente"
        })
    } catch (error) {
        next(error)
    } finally {
        const loggerBody = {
            log_table_name: "companies",
            log_field_id,
            log_body: req.body,
            log_action: USER_ACTIONS.DESACTIVACION,
            log_response: response,
            log_created_by: req.user?.usr_name
        }

        logger(loggerBody)
    }
}

export const companyController = {
    getCompanies,
    createCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
}