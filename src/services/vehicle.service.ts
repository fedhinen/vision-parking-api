
import { prisma } from "../utils/lib/prisma";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { userService } from "./user.service";

const {
    LNG011,
    LNG043,
    LNG042,
    LNG044,
    LNG031,
    LNG065,
    LNG066
} = ERROR_CATALOG.businessLogic

const getCompanyVehicles = async (companyId: string) => {
    try {
        const users = await prisma.users.findMany({
            include: {
                company_users: {
                    where: {
                        company: {
                            cmp_id: companyId
                        }
                    }
                }
            }
        })

        const data = []

        for (const user of users) {
            const userVehicles = await prisma.user_vehicles.findMany({
                where: {
                    usr_id: user.usr_id,
                },
            })

            const vehicleIds = userVehicles.map(userVehicle => userVehicle.veh_id);

            const vehicles = await prisma.vehicles.findMany({
                where: {
                    veh_id: {
                        in: vehicleIds
                    }
                },
                select: {
                    veh_id: true,
                    veh_plate: true,
                    veh_brand: true,
                    veh_model: true,
                    veh_year: true,
                    veh_color: true,
                    veh_active: true
                }
            });

            data.push({
                user: {
                    usr_name: user.usr_name,
                },
                vehicles: vehicles
            })
        }

        return data
    } catch (error) {
        throw new InternalServerError(LNG065)
    }
}

const getUserVehicles = async (userId: string) => {
    try {
        const userVehicles = await prisma.user_vehicles.findMany({
            where: {
                usr_id: userId,
                uv_active: true
            }
        })

        const vehicleIds = userVehicles.map(userVehicle => userVehicle.veh_id);

        const vehicles = await prisma.vehicles.findMany({
            where: {
                veh_id: {
                    in: vehicleIds
                },
                veh_active: true
            },
            select: {
                veh_id: true,
                veh_plate: true,
                veh_brand: true,
                veh_model: true,
                veh_year: true,
                veh_color: true
            }
        });

        return vehicles
    } catch (error) {
        throw new InternalServerError(LNG065);
    }
}

const createVehicle = async (body: any) => {
    const {
        veh_plate,
        veh_brand,
        veh_model,
        veh_color,
        veh_year,
        usr_id
    } = body

    const user = await userService.getUserById(usr_id)

    await checkCountVehicles(usr_id);

    try {
        const result = await prisma.$transaction(async (tx) => {
            const newVehicle = await tx.vehicles.create({
                data: {
                    veh_plate,
                    veh_brand,
                    veh_model,
                    veh_color,
                    veh_year,
                    veh_created_by: "system"
                }
            });

            await tx.user_vehicles.create({
                data: {
                    usr_id: user.usr_id,
                    veh_id: newVehicle.veh_id,
                    uv_created_by: "system"
                }
            });

            return newVehicle;
        });

        return result
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('veh_plate')
            ) {
                throw new ConflictError(LNG011);
            }
        }

        throw new InternalServerError(LNG042);
    }
}

const getVehicleById = async (vehicleId: string) => {
    try {
        const vehicle = await prisma.vehicles.findUnique({
            where: {
                veh_id: vehicleId,
                veh_active: true
            }
        });

        if (!vehicle) {
            throw new NotFoundError(LNG043);
        }

        return vehicle;
    } catch (error) {
        throw error;
    }
}

const updateVehicle = async (vehicleId: string, body: any) => {
    const vehicle = await getVehicleById(vehicleId);

    try {
        const updatedVehicle = await prisma.vehicles.update({
            where: {
                veh_id: vehicle.veh_id
            },
            data: body
        });

        return updatedVehicle;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('veh_plate')
            ) {
                throw new ConflictError(LNG011);
            }
        }

        throw new InternalServerError(LNG044);
    }
}

const deleteVehicle = async (vehicleId: string) => {
    const vehicle = await getVehicleById(vehicleId);

    try {
        await prisma.vehicles.update({
            where: {
                veh_id: vehicle.veh_id
            },
            data: {
                veh_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG031);
    }
}

const checkCountVehicles = async (userId: string) => {
    try {
        const vehiclesCount = await prisma.user_vehicles.count({
            where: {
                usr_id: userId,
                uv_active: true
            }
        })

        if (vehiclesCount >= 4) {
            throw new BadRequestError(LNG066);
        }

        return vehiclesCount
    } catch (error) {
        throw error
    }
}

export const vehicleService = {
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getCompanyVehicles,
    getUserVehicles
} 