
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { clientSchema, updateClientSchema, ClientSchema, UpdateClientSchema } from "../schemas/client.schema";

const {
    LNG029,
    LNG039,
    LNG040,
    LNG041
} = ERROR_CATALOG.businessLogic

const createClient = async (body: ClientSchema) => {
    const validatedData = clientSchema.parse(body);

    try {
        const newClient = await prisma.clients.create({
            data: {
                cte_name: validatedData.cte_name,
                cte_phone: validatedData.cte_phone,
                cte_email: validatedData.cte_email,
                cte_address: validatedData.cte_address,
                cte_zipcode: validatedData.cte_zipcode,
                cmp_id: validatedData.cmp_id,
                cte_created_by: "system" // You might want to pass this as parameter
            },
            include: {
                company: true
            }
        });
        return newClient;
    } catch (error) {
        throw new InternalServerError(LNG039);
    }
}

const getClientById = async (clientId: string) => {
    try {
        const client = await prisma.clients.findUnique({
            where: {
                cte_id: clientId,
                cte_active: true
            },
            include: {
                company: true
            }
        });

        if (!client) {
            throw new NotFoundError(LNG029);
        }

        return client;
    } catch (error) {
        throw error;
    }
}

const updateClient = async (clientId: string, body: UpdateClientSchema) => {
    const validatedData = updateClientSchema.parse(body);
    
    const client = await getClientById(clientId);

    try {
        const updatedClient = await prisma.clients.update({
            where: {
                cte_id: client.cte_id
            },
            data: validatedData,
            include: {
                company: true
            }
        });

        return updatedClient;
    } catch (error) {
        throw new InternalServerError(LNG040);
    }
}

const deleteClient = async (clientId: string) => {
    const client = await getClientById(clientId);

    try {
        await prisma.clients.update({
            where: {
                cte_id: client.cte_id
            },
            data: {
                cte_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG041);
    }
}

export const clientService = {
    createClient,
    getClientById,
    updateClient,
    deleteClient
} 