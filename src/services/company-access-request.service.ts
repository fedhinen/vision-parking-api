
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { companyAccessRequestSchema, updateCompanyAccessRequestSchema, CompanyAccessRequestSchema, UpdateCompanyAccessRequestSchema } from "../schemas/company-access-request.schema";

const {
    LNG063,
    LNG026,
    LNG064,
    LNG034
} = ERROR_CATALOG.businessLogic

const createCompanyAccessRequest = async (body: CompanyAccessRequestSchema) => {
    const validatedData = companyAccessRequestSchema.parse(body);

    try {
        const newCompanyAccessRequest = await prisma.company_access_requests.create({
            data: {
                usr_id: validatedData.usr_id,
                cmp_id: validatedData.cmp_id,
                stu_id: validatedData.stu_id,
                cma_description: validatedData.cma_description,
                cma_created_by: "system" // You might want to pass this as parameter
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

const updateCompanyAccessRequest = async (id: string, body: UpdateCompanyAccessRequestSchema) => {
    const validatedData = updateCompanyAccessRequestSchema.parse(body);
    
    const companyAccessRequest = await getCompanyAccessRequestById(id);

    try {
        const updatedCompanyAccessRequest = await prisma.company_access_requests.update({
            where: {
                cma_id: companyAccessRequest.cma_id
            },
            data: {
                ...validatedData,
                // If approving the request, set approval fields
                ...(validatedData.stu_id && {
                    cma_approved_date: new Date(),
                    cma_approved_by: "system" // You might want to pass this as parameter
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