import { NextFunction, Request, Response } from "express";
import { reportService } from "../services/report.service";

const vehiclesCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    const {
        color,
        model,
        brand,
        year,
        plate,
        active,
        userId
    } = req.query;

    const filters = {
        color,
        model,
        brand,
        year: year ? Number(year) : undefined,
        plate,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        userId
    }

    try {
        const data = await reportService.vehiclesCompanyReport(companyId, filters);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const reservationsCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    const {
        initial_date,
        end_date,
        statusId,
        userId
    } = req.query;

    const filters = {
        initial_date: initial_date ? new Date(initial_date as string) : undefined,
        end_date: end_date ? new Date(end_date as string) : undefined,
        statusId,
        userId
    }

    try {
        const data = await reportService.reservationsCompanyReport(companyId, filters);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const parkingSpotsCompanyReport = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    const {
        parkingSpotId,
        statusId,
        userId,
        initial_date,
        end_date
    } = req.query;

    const filters = {
        parkingSpotId,
        statusId,
        userId,
        initial_date: initial_date ? new Date(initial_date as string) : undefined,
        end_date: end_date ? new Date(end_date as string) : undefined
    }

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