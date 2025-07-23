import { NextFunction, Request, Response } from "express";
import { companySchema } from "../schemas/company.schema";
import { ValidationError } from "../middleware/error/error";
import { companyService } from "../services/company.service";
import { logger } from "../utils/logger";

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
            log_table_name: "users",
            log_field_id,
            log_body: req.body,
            log_action: req.method,
            log_response: response,
            log_created_by: req.user?.usr_name
        }

        logger(loggerBody)
    }
}

export const companyController = {
    createCompany
}