import { NextFunction, Request, Response } from "express";
import { reportService } from "../services/report.service";

const vehiclesCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;
    const filters = req.query;

    try {
        const data = await reportService.vehiclesCompanyReport(companyId, filters);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const reservationsCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;
    const filters = req.query;

    try {
        const data = await reportService.reservationsCompanyReport(companyId, filters);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const parkingSpotsCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;
    const filters = req.query;

    try {
        const data = await reportService.parkingSpotsCompanyReport(companyId, filters);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

export const reportController = {
    vehiclesReport: vehiclesCompanyReport,
    reservationsReport: reservationsCompanyReport,
    parkingSpotsReport: parkingSpotsCompanyReport
}