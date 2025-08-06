import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../middleware/error/error";
import { rfidTagService } from "../services/rfid-tag.service";
import { rfidTagSchema } from "../schemas/rfid-tag.schema";

const createRFIDTag = async (req: Request, res: Response, next: NextFunction) => {
    const result = rfidTagSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error);
    }

    const body = result.data;

    try {
        const rfidTag = await rfidTagService.createRFIDTag(body);

        res.status(201).json({
            message: "Tag RFID creado correctamente",
            data: rfidTag
        });
    } catch (error) {
        next(error);
    }
}

const getRFIDTagById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const rfidTag = await rfidTagService.getRFIDTagById(id);

        res.status(200).json({
            message: "Tag RFID obtenido correctamente",
            data: rfidTag
        });
    } catch (error) {
        next(error);
    }
}

const getRFIDTagsByCompanyId = async (req: Request, res: Response, next: NextFunction) => {
    const { companyId } = req.params;

    try {
        const rfidTags = await rfidTagService.getRFIDTagsByCompanyId(companyId);

        res.status(200).json({
            message: "Tags RFID obtenidos correctamente",
            data: rfidTags
        });
    } catch (error) {
        next(error);
    }
}

export const rfidTagController = {
    createRFIDTag,
    getRFIDTagById,
    getRFIDTagsByCompanyId
}