
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";

const {
    LNG063,
    LNG026,
    LNG064,
    LNG034
} = ERROR_CATALOG.businessLogic

const createCompanyAccessRequest = async (body: any) => {
    const {
        usr_id,
        cmp_id,
        stu_id,
        cma_description
    } = body;

    try {
        const newCompanyAccessRequest = await prisma.company_access_requests.create({
            data: {
                usr_id: usr_id,
                cmp_id: cmp_id,
                stu_id: stu_id,
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

const updateCompanyAccessRequest = async (id: string, body: any) => {
    const companyAccessRequest = await getCompanyAccessRequestById(id);

    try {
        const updatedCompanyAccessRequest = await prisma.company_access_requests.update({
            where: {
                cma_id: companyAccessRequest.cma_id
            },
            data: {
                ...body,
                ...(body.stu_id && {
                    cma_approved_date: new Date(),
                    cma_approved_by: "system"
                })
            }
        });

        return updatedCompanyAccessRequest;
    } catch (error) {
        throw new InternalServerError(LNG064);
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
    updateCompanyAccessRequest,
    deleteCompanyAccessRequest
} 