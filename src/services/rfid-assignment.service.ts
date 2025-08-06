
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { companyService } from "./company.service";

const {
    LNG056,
    LNG055,
    LNG057,
    LNG058,
    LNG082
} = ERROR_CATALOG.businessLogic

const createRfidAssigment = async (body: any) => {
    const { rft_id, usr_id } = body;

    try {
        const newRfidAssignment = await prisma.rfid_assignments.create({
            data: {
                rft_id: rft_id,
                usr_id: usr_id,
                rfa_created_by: "system"
            },
            include: {
                rfid_tag: true,
                user: true
            }
        });
        return newRfidAssignment;
    } catch (error) {
        throw new InternalServerError(LNG055);
    }
}

const getRfidAssignmentById = async (rfidAssignmentId: string) => {
    try {
        const rfidAssignment = await prisma.rfid_assignments.findUnique({
            where: {
                rfa_id: rfidAssignmentId,
            },
            include: {
                rfid_tag: true,
                user: true
            }
        });

        if (!rfidAssignment) {
            throw new NotFoundError(LNG056);
        }

        return rfidAssignment;
    } catch (error) {
        throw error;
    }
}

const updateRfidAssigment = async (rfidAssignmentId: string, body: any) => {
    const rfidAssignment = await getRfidAssignmentById(rfidAssignmentId);

    try {
        const updatedRfidAssignment = await prisma.rfid_assignments.update({
            where: {
                rfa_id: rfidAssignment.rfa_id
            },
            data: body,
            include: {
                rfid_tag: true,
                user: true
            }
        });

        return updatedRfidAssignment;
    } catch (error) {
        throw new InternalServerError(LNG057);
    }
}

const deleteRfidAssignment = async (rfidAssignmentId: string) => {
    const rfidAssignment = await getRfidAssignmentById(rfidAssignmentId);

    try {
        await prisma.rfid_assignments.update({
            where: {
                rfa_id: rfidAssignment.rfa_id
            },
            data: {
                rfa_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG058);
    }
}

const getRfidAssignmentsByCompanyId = async (cmp_id: string) => {
    const company = await companyService.getCompanyById(cmp_id)

    const companyUsers = await companyService.getUsersByCompanyId(company.cmp_id)

    const userIds = companyUsers.map(user => user.usr_id)

    try {
        const rfidAssignments = await prisma.rfid_assignments.findMany({
            where: {
                usr_id: {
                    in: userIds
                }
            },
            include: {
                user: {
                    select: {
                        usr_id: true,
                        usr_name: true,
                        usr_email: true
                    }
                },
                rfid_tag: {
                    select: {
                        rft_id: true,
                        rft_tag: true
                    }
                }
            }
        })

        return rfidAssignments
    } catch (error) {
        throw new InternalServerError(LNG082)
    }
}

export const rfidAssignmentService = {
    createRfidAssigment,
    getRfidAssignmentById,
    updateRfidAssigment,
    deleteRfidAssignment,
    getRfidAssignmentsByCompanyId
}