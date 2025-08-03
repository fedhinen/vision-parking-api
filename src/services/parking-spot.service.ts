
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { parkingLotService } from "./parking-lot.service";

const {
    LNG049,
    LNG048,
    LNG050,
    LNG033,
    LNG071
} = ERROR_CATALOG.businessLogic

const getParkingSpotsByLotId = async (parkingLotId: string) => {
    const parkingLot = await parkingLotService.getParkingLotById(parkingLotId);

    try {
        const parkingSpots = await prisma.parking_spots.findMany({
            where: {
                pkl_id: parkingLot.pkl_id
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
        return parkingSpots;
    } catch (error) {
        throw new InternalServerError(LNG071);
    }
}

const createParkingSpot = async (body: any) => {
    const {
        pkl_id,
        stu_id,
        pks_number,
        pks_order
    } = body

    try {
        const newParkingSpot = await prisma.parking_spots.create({
            data: {
                pkl_id: pkl_id,
                stu_id: stu_id,
                pks_number: pks_number,
                pks_order: pks_order,
                pks_created_by: "system"
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

const updateParkingSpot = async (parkingSpotId: string, body: any) => {
    const parkingSpot = await getParkingSpotById(parkingSpotId);

    try {
        const updatedParkingSpot = await prisma.parking_spots.update({
            where: {
                pks_id: parkingSpot.pks_id
            },
            data: body,
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
    getParkingSpotsByLotId,
    createParkingSpot,
    getParkingSpotById,
    updateParkingSpot,
    deleteParkingSpot
} 