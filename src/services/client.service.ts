
import { prisma } from "../utils/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { clientConfig } from "../utils/client-config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const {
    LNG029,
    LNG039,
    LNG040,
    LNG041,
    LNG068
} = ERROR_CATALOG.businessLogic

const createClient = async (body: any) => {
    const {
        cte_name,
        cte_phone,
        cte_email,
        cte_address,
        cte_zipcode,
        cmp_id
    } = body

    try {
        const newClient = await prisma.clients.create({
            data: {
                cte_name: cte_name,
                cte_phone: cte_phone,
                cte_email: cte_email,
                cte_address: cte_address,
                cte_zipcode: cte_zipcode,
                cmp_id: cmp_id,
                cte_created_by: "system"
            },
            include: {
                company: true
            }
        });

        if (newClient) {
            await createDefaultClientConfiguration(newClient.cmp_id);
        }

        return newClient;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('cte_name')
            ) {
                throw new ConflictError(LNG068);
            }
        }
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

const updateClient = async (clientId: string, body: any) => {
    const client = await getClientById(clientId);

    try {
        const updatedClient = await prisma.clients.update({
            where: {
                cte_id: client.cte_id
            },
            data: body,
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

const createDefaultClientConfiguration = async (companyId: string) => {
    const parkingLot = await clientConfig.createParkingLot(companyId);
    await clientConfig.createDefaultParkingSpots(parkingLot.pkl_id);
}

export const clientService = {
    createClient,
    getClientById,
    updateClient,
    deleteClient
} 