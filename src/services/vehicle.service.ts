
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { vehicleSchema, updateVehicleSchema, VehicleSchema, UpdateVehicleSchema } from "../schemas/vehicle.schema";

const {
    LNG043,
    LNG042,
    LNG044,
    LNG031
} = ERROR_CATALOG.businessLogic

const createVehicle = async (body: VehicleSchema) => {
    const validatedData = vehicleSchema.parse(body);

    try {
        const newVehicle = await prisma.vehicles.create({
            data: {
                veh_plate: validatedData.veh_plate,
                veh_brand: validatedData.veh_brand,
                veh_model: validatedData.veh_model,
                veh_color: validatedData.veh_color,
                veh_year: validatedData.veh_year,
                veh_created_by: "system" // You might want to pass this as parameter
            }
        });
        return newVehicle;
    } catch (error) {
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

const updateVehicle = async (vehicleId: string, body: UpdateVehicleSchema) => {
    const validatedData = updateVehicleSchema.parse(body);
    
    const vehicle = await getVehicleById(vehicleId);

    try {
        const updatedVehicle = await prisma.vehicles.update({
            where: {
                veh_id: vehicle.veh_id
            },
            data: validatedData
        });

        return updatedVehicle;
    } catch (error) {
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

export const vehicleService = {
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} 