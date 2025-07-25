import { NextFunction, Request, Response } from "express"
import { clientService } from "../services/client.service"
import { clientSchema, updateClientSchema } from "../schemas/client.schema"
import { ZodError } from "zod"

const createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = clientSchema.parse(req.body);
        const client = await clientService.createClient(validatedData);
        
        res.status(201).json({
            success: true,
            message: "Cliente creado exitosamente",
            data: client
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Datos de entrada inválidos",
                errors: error.issues
            });
        }
        next(error);
    }
}

const getClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientId } = req.params;
        const client = await clientService.getClientById(clientId);
        
        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        next(error);
    }
}

const updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientId } = req.params;
        const validatedData = updateClientSchema.parse(req.body);
        const client = await clientService.updateClient(clientId, validatedData);
        
        res.status(200).json({
            success: true,
            message: "Cliente actualizado exitosamente",
            data: client
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Datos de entrada inválidos",
                errors: error.issues
            });
        }
        next(error);
    }
}

const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { clientId } = req.params;
        await clientService.deleteClient(clientId);
        
        res.status(200).json({
            success: true,
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