
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { parkingSpotService } from "./parking-spot.service";

const {
    LNG046,
    LNG045,
    LNG047,
    LNG032,
    LNG070
} = ERROR_CATALOG.businessLogic

const getParkingLotsByCompanyId = async (companyId: string) => {
    try {
        const parkingLots = await prisma.parking_lots.findMany({
            where: {
                cmp_id: companyId,
                pkl_active: true
            },
            include: {
                parking_spots: {
                    select: {
                        pks_id: true,
                        pks_number: true,
                        status: {
                            select: {
                                stu_name: true
                            }
                        }
                    },
                    orderBy: {
                        pks_order: 'asc'
                    }
                }
            }
        });

        return parkingLots;
    } catch (error) {
        throw new InternalServerError(LNG070);
    }
}

const createParkingLot = async (body: any) => {
    const {
        cmp_id,
        pkl_name
    } = body

    try {
        const newParkingLot = await prisma.parking_lots.create({
            data: {
                cmp_id: cmp_id,
                pkl_name: pkl_name,
                pkl_created_by: "system"
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

const updateParkingLot = async (parkingLotId: string, body: any) => {
    const parkingLot = await getParkingLotById(parkingLotId);

    try {
        const updatedParkingLot = await prisma.parking_lots.update({
            where: {
                pkl_id: parkingLot.pkl_id
            },
            data: body,
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
    getParkingLotsByCompanyId,
    createParkingLot,
    getParkingLotById,
    updateParkingLot,
    deleteParkingLot
} 