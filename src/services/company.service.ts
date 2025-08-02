import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";

const {
    LNG035,
    LNG036,
    LNG037,
    LNG038,
    LNG069
} = ERROR_CATALOG.businessLogic

const getCompanies = async () => {
    try {
        const companies = await prisma.companies.findMany({
            where: {
                cmp_active: true
            }
        });
        return companies;
    } catch (error) {
        throw new InternalServerError(LNG069);
    }
}

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

const getCompanyById = async (companyId: string) => {
    try {
        const company = await prisma.companies.findUnique({
            where: {
                cmp_id: companyId
            }
        })

        if (!company) {
            throw new NotFoundError(LNG036)
        }

        return company
    } catch (error) {
        throw error
    }
}

const updateCompany = async (companyId: string, body: any) => {
    const { cmp_name } = body

    const company = await getCompanyById(companyId)

    try {
        const updatedCompany = await prisma.companies.update({
            where: {
                cmp_id: company.cmp_id
            },
            data: {
                cmp_name
            }
        })

        return updatedCompany
    } catch (error) {
        throw new InternalServerError(LNG037)
    }
}

const deleteCompany = async (companyId: string) => {
    const company = await getCompanyById(companyId)

    try {
        await prisma.companies.update({
            where: {
                cmp_id: company.cmp_id
            },
            data: {
                cmp_active: false
            }
        })
    } catch (error) {
        throw new InternalServerError(LNG038)
    }
}

export const companyService = {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
}