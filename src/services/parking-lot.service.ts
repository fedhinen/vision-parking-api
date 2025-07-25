
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { parkingLotSchema, updateParkingLotSchema, ParkingLotSchema, UpdateParkingLotSchema } from "../schemas/parking-lot.schema";

const {
    LNG046,
    LNG045,
    LNG047,
    LNG032
} = ERROR_CATALOG.businessLogic

const createParkingLot = async (body: ParkingLotSchema) => {
    const validatedData = parkingLotSchema.parse(body);

    try {
        const newParkingLot = await prisma.parking_lots.create({
            data: {
                cmp_id: validatedData.cmp_id,
                pkl_name: validatedData.pkl_name,
                pkl_created_by: "system" // You might want to pass this as parameter
            },
            include: {
                company: true
            }
        });
        return newParkingLot;
    } catch (error) {
        throw new InternalServerError(LNG045);
    }
}

const getParkingLotById = async (parkingLotId: string) => {
    try {
        const parkingLot = await prisma.parking_lots.findUnique({
            where: {
                pkl_id: parkingLotId,
                pkl_active: true
            },
            include: {
                company: true
            }
        });

        if (!parkingLot) {
            throw new NotFoundError(LNG046);
        }

        return parkingLot;
    } catch (error) {
        throw error;
    }
}

const updateParkingLot = async (parkingLotId: string, body: UpdateParkingLotSchema) => {
    const validatedData = updateParkingLotSchema.parse(body);
    
    const parkingLot = await getParkingLotById(parkingLotId);

    try {
        const updatedParkingLot = await prisma.parking_lots.update({
            where: {
                pkl_id: parkingLot.pkl_id
            },
            data: validatedData,
            include: {
                company: true
            }
        });

        return updatedParkingLot;
    } catch (error) {
        throw new InternalServerError(LNG047);
    }
}

const deleteParkingLot = async (parkingLotId: string) => {
    const parkingLot = await getParkingLotById(parkingLotId);

    try {
        await prisma.parking_lots.update({
            where: {
                pkl_id: parkingLot.pkl_id
            },
            data: {
                pkl_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG032);
    }
}

export const parkingLotService = {
    createParkingLot,
    getParkingLotById,
    updateParkingLot,
    deleteParkingLot
} 