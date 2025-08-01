import { NextFunction, Request, Response } from "express"
import { clientService } from "../services/client.service"
import { clientSchema, updateClientSchema } from "../schemas/client.schema"
import { ZodError } from "zod"

const createClient = async (req: Request, res: Response, next: NextFunction) => {
    const result = clientSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const client = await clientService.createClient(body);

        res.status(201).json({
            message: "Cliente creado exitosamente",
            data: client
        });
    } catch (error) {
        next(error);
    }
}

const getClientById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const client = await clientService.getClientById(id);

        res.status(200).json({
            data: client
        });
    } catch (error) {
        next(error);
    }
}

const updateClient = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = updateClientSchema.safeParse(req.body);

    if (!result.success) {
        throw new ZodError(result.error.issues);
    }

    const body = result.data;

    try {
        const client = await clientService.updateClient(id, body);

        res.status(200).json({
            message: "Cliente actualizado exitosamente",
            data: client
        });
    } catch (error) {
        next(error);
    }
}

const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await clientService.deleteClient(id);

        res.status(200).json({
            message: "Cliente eliminado exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const clientController = {
    createClient,
    getClientById,
    updateClient,
    deleteClient
}