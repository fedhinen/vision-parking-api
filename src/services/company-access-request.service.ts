
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { statusService } from "./status.service";

const {
    LNG063,
    LNG026,
    LNG034,
    LNG075,
    LNG076
} = ERROR_CATALOG.businessLogic

const createCompanyAccessRequest = async (body: any) => {
    const {
        usr_id,
        cmp_id,
        cma_description
    } = body;

    try {
        const status = await
            statusService.getStatusByTableAndName(
                "company_access_requests",
                "Pendiente"
            )

        const newCompanyAccessRequest = await prisma.company_access_requests.create({
            data: {
                usr_id: usr_id,
                cmp_id: cmp_id,
                stu_id: status.stu_id,
                cma_description: cma_description,
                cma_created_by: "system"
            }
        });
        return newCompanyAccessRequest;
    } catch (error) {
        throw new InternalServerError(LNG026);
    }
}

const getCompanyAccessRequestById = async (id: string) => {
    try {
        const companyAccessRequest = await prisma.company_access_requests.findUnique({
            where: {
                cma_id: id,
                cma_active: true
            }
        });

        if (!companyAccessRequest) {
            throw new NotFoundError(LNG063);
        }

        return companyAccessRequest;
    } catch (error) {
        throw error;
    }
}

const acceptCompanyAccessRequest = async (id: string) => {
    const companyAccessRequest = await getCompanyAccessRequestById(id);

    const status = await statusService.getStatusByTableAndName(
        "company_access_requests",
        "Aceptada"
    );

    try {
        const updatedCompanyAccessRequest = await prisma.company_access_requests.update({
            where: {
                cma_id: companyAccessRequest.cma_id
            },
            data: {
                stu_id: status.stu_id,
                cma_approved_date: new Date(),
                cma_approved_by: "system"
            }
        });

        return updatedCompanyAccessRequest;
    } catch (error) {
        throw new InternalServerError(LNG075);
    }
}

const rejectCompanyAccessRequest = async (id: string) => {
    const companyAccessRequest = await getCompanyAccessRequestById(id);

    const status = await statusService.getStatusByTableAndName(
        "company_access_requests",
        "Rechazada"
    );

    try {
        const updatedCompanyAccessRequest = await prisma.company_access_requests.update({
            where: {
                cma_id: companyAccessRequest.cma_id
            },
            data: {
                stu_id: status.stu_id,
                cma_active: false
            }
        });

        return updatedCompanyAccessRequest;
    } catch (error) {
        throw new InternalServerError(LNG076);
    }
}

const deleteCompanyAccessRequest = async (id: string) => {
    const companyAccessRequest = await getCompanyAccessRequestById(id);

    try {
        await prisma.company_access_requests.update({
            where: {
                cma_id: companyAccessRequest.cma_id
            },
            data: {
                cma_active: false
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG034);
    }
}

export const companyAccessRequestService = {
    createCompanyAccessRequest,
    getCompanyAccessRequestById,
    acceptCompanyAccessRequest,
    rejectCompanyAccessRequest,
    deleteCompanyAccessRequest
} 