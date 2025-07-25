
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { parkingSpotSchema, updateParkingSpotSchema, ParkingSpotSchema, UpdateParkingSpotSchema } from "../schemas/parking-spot.schema";

const {
    LNG049,
    LNG048,
    LNG050,
    LNG033
} = ERROR_CATALOG.businessLogic

const createParkingSpot = async (body: ParkingSpotSchema) => {
    const validatedData = parkingSpotSchema.parse(body);

    try {
        const newParkingSpot = await prisma.parking_spots.create({
            data: {
                pkl_id: validatedData.pkl_id,
                stu_id: validatedData.stu_id,
                pks_number: validatedData.pks_number,
                pks_created_by: "system" // You might want to pass this as parameter
            },
            include: {
                status: true
            }
        });
        return newParkingSpot;
    } catch (error) {
        throw new InternalServerError(LNG048);
    }
}

const getParkingSpotById = async (parkingSpotId: string) => {
    try {
        const parkingSpot = await prisma.parking_spots.findUnique({
            where: {
                pks_id: parkingSpotId
            },
            include: {
                status: true,
                reservations: {
                    where: {
                        rsv_end_date: {
                            gte: new Date()
                        }
                    }
                },
                spot_assignments: {
                    where: {
                        spa_active: true
                    },
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!parkingSpot) {
            throw new NotFoundError(LNG049);
        }

        return parkingSpot;
    } catch (error) {
        throw error;
    }
}

const updateParkingSpot = async (parkingSpotId: string, body: UpdateParkingSpotSchema) => {
    const validatedData = updateParkingSpotSchema.parse(body);
    
    const parkingSpot = await getParkingSpotById(parkingSpotId);

    try {
        const updatedParkingSpot = await prisma.parking_spots.update({
            where: {
                pks_id: parkingSpot.pks_id
            },
            data: validatedData,
            include: {
                status: true
            }
        });

        return updatedParkingSpot;
    } catch (error) {
        throw new InternalServerError(LNG050);
    }
}

const deleteParkingSpot = async (parkingSpotId: string) => {
    const parkingSpot = await getParkingSpotById(parkingSpotId);

    try {
        // Soft delete by deactivating related assignments and then the spot
        await prisma.spot_assignments.updateMany({
            where: {
                pks_id: parkingSpot.pks_id
            },
            data: {
                spa_active: false
            }
        });

        // For this model, we don't have an "active" field, so we might need to delete directly
        // or handle it differently based on business logic
        await prisma.parking_spots.delete({
            where: {
                pks_id: parkingSpot.pks_id
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG033);
    }
}

export const parkingSpotService = {
    createParkingSpot,
    getParkingSpotById,
    updateParkingSpot,
    deleteParkingSpot
} 