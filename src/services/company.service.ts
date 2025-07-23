import { prisma } from "../utils/lib/prisma";
import { InternalServerError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";

const { LNG035 } = ERROR_CATALOG.businessLogic

const createCompany = async (body: any) => {
    const { cmp_name } = body

    try {
        const newCompany = await prisma.companies.create({
            data: {
                cmp_name
            }
        });
        return newCompany;
    } catch (error) {
        throw new InternalServerError(LNG035);
    }
}

export const companyService = {
    createCompany
}