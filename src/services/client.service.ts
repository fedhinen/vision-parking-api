
import { prisma } from "../utils/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { clientConfig } from "../utils/client-config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { userService } from "./user.service";
import { companyService } from "./company.service";

const {
    LNG029,
    LNG039,
    LNG040,
    LNG041,
    LNG068,
    LNG088
} = ERROR_CATALOG.businessLogic

const {
    AUTH002
} = ERROR_CATALOG.autentication

const createClient = async (body: any) => {
    const {
        cte_name,
        cte_phone,
        cte_email,
        cte_address,
        cte_zipcode,
        cmp_id
    } = body

    const company = await companyService.getCompanyById(cmp_id);

    try {
        const newClient = await prisma.clients.create({
            data: {
                cte_name: cte_name,
                cte_phone: cte_phone,
                cte_email: cte_email,
                cte_address: cte_address,
                cte_zipcode: cte_zipcode,
                cmp_id: company.cmp_id,
                cte_created_by: "system"
            },
            include: {
                company: true
            }
        });

        if (newClient) {
            await userService.signup({
                usr_name: `${newClient.cte_email.split("@")[0]}.client`,
                usr_email: newClient.cte_email,
                usr_password: `VisionParking${new Date().getFullYear()}!`,
                cmp_id: newClient.cmp_id,
                pry_name: "VISION_PARKING_WEB"
            })
            await createDefaultClientConfiguration(newClient);
        }

        return newClient;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('cte_name')
            ) {
                throw new ConflictError(LNG068);
            } else if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('cte_email')
            ) {
                throw new ConflictError(AUTH002);
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

const createDefaultClientConfiguration = async (newClient: any) => {
    const parkingLot = await clientConfig.createParkingLot(newClient.cmp_id);
    await clientConfig.createDefaultParkingSpots(parkingLot.pkl_id);
}

const getClientCompanyByUserId = async (userId: string) => {
    const user = await userService.getUserById(userId);

    try {
        const userClient = await prisma.clients.findFirst({
            where: {
                cte_email: user.usr_email,
            }
        })

        return userClient
    } catch (error) {
        throw new InternalServerError(LNG088)
    }
}

export const clientService = {
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    getClientCompanyByUserId
} 