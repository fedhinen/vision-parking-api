import { NextFunction, Request, Response } from "express";
import { statusService } from "../services/status.service";

const getStatusByTableAndName = async (req: Request, res: Response, next: NextFunction) => {
    const { table, statusName } = req.query;
    console.log(table, statusName);

    try {
        const status = await statusService.getStatusByTableAndName(table as string, statusName as string);
        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
}

export const statusController = {
    getStatusByTableAndName
}