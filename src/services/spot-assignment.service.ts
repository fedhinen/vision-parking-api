
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { spotAssignmentSchema, updateSpotAssignmentSchema, SpotAssignmentSchema, UpdateSpotAssignmentSchema } from "../schemas/spot-assignment.schema";

const {
    LNG060,
    LNG059,
    LNG061,
    LNG062
} = ERROR_CATALOG.businessLogic

const createSpotAssigment = async (body: any) => {
    const { pks_id, usr_id } = body

    try {
        const newSpotAssignment = await prisma.spot_assignments.create({
            data: {
                pks_id: pks_id,
                usr_id: usr_id,
                spa_created_by: "system"
            },
            include: {
                parking_spot: {
                    include: {
                        status: true
                    }
                },
                user: true
            }
        });
        return newSpotAssignment;
    } catch (error) {
        throw new InternalServerError(LNG059);
    }
}

const getSpotAssignmentById = async (spotAssignmentId: string) => {
    try {
        const spotAssignment = await prisma.spot_assignments.findUnique({
            where: {
                spa_id: spotAssignmentId,
                spa_active: true
            },
            include: {
                parking_spot: {
                    include: {
                        status: true
                    }
                },
                user: true
            }
        });

        if (!spotAssignment) {
            throw new NotFoundError(LNG060);
        }

        return spotAssignment;
    } catch (error) {
        throw error;
    }
}

const updateSpotAssigment = async (spotAssignmentId: string, body: any) => {
    const spotAssignment = await getSpotAssignmentById(spotAssignmentId);

    try {
        const updatedSpotAssignment = await prisma.spot_assignments.update({
            where: {
                spa_id: spotAssignment.spa_id
            },
            data: body,
            include: {
                parking_spot: {
                    include: {
                        status: true
                    }
                },
                user: true
            }
        });

        return updatedSpotAssignment;
    } catch (error) {
        throw new InternalServerError(LNG061);
    }
}

const deleteSpotAssignment = async (spotAssignmentId: string) => {
    const spotAssignment = await getSpotAssignmentById(spotAssignmentId);

    try {
        await prisma.spot_assignments.update({
            where: {
                spa_id: spotAssignment.spa_id
            },
            data: {
                spa_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG062);
    }
}

export const spotAssignmentService = {
    createSpotAssigment,
    getSpotAssignmentById,
    updateSpotAssigment,
    deleteSpotAssignment
}