import { NextFunction, Request, Response } from "express";
import { companySchema } from "../schemas/company.schema";
import { ValidationError } from "../middleware/error/error";
import { companyService } from "../services/company.service";

const getCompanies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await companyService.getCompanies();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
}

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    const result = companySchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const newCompany = await companyService.createCompany(body)
        res.status(201).json(newCompany)
    } catch (error) {
        next(error)
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
    const { id } = req.params
    const result = companySchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const updatedCompany = await companyService.updateCompany(id, body)
        res.status(200).json(updatedCompany)
    } catch (error) {
        next(error)
    }
}

const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        await companyService.deleteCompany(id)
        res.status(204).json({
            message: "Compañia eliminada correctamente"
        })
    } catch (error) {
        next(error)
    }
}

export const companyController = {
    getCompanies,
    createCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
}