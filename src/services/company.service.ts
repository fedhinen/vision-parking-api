import { prisma } from "../utils/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { userService } from "./user.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const {
    LNG035,
    LNG036,
    LNG037,
    LNG038,
    LNG069,
    LNG077,
    LNG078,
    LNG079,
    LNG087,
    LNG099
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

const getCompanyByUserId = async (userId: string) => {
    const user = await userService.getUserById(userId)

    try {
        const userCompany = await prisma.company_users.findFirst({
            where: {
                usr_id: user.usr_id
            },
        })

        const company = await prisma.companies.findUnique({
            where: {
                cmp_id: userCompany?.cmp_id
            }
        })

        return company
    } catch (error) {
        throw new InternalServerError(LNG077);
    }
}

const getUsersByCompanyId = async (companyId: string) => {
    const company = await getCompanyById(companyId)

    try {
        const usersCompany = await prisma.company_users.findMany({
            where: {
                cmp_id: company.cmp_id
            }
        })

        const userIds = usersCompany.map(user => user.usr_id)

        const users = await prisma.users.findMany({
            where: {
                usr_id: {
                    in: userIds
                },
            },
            select: {
                usr_id: true,
                usr_name: true,
                usr_email: true,
                usr_date: true,
                pry_name: true
            }
        })

        return users
    } catch (error) {
        throw new InternalServerError(LNG079);
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
        if (error instanceof PrismaClientKnownRequestError) {
            if (
                error.code === 'P2002' &&
                String(error?.meta?.target).includes('cmp_name')
            ) {
                throw new ConflictError(LNG099);
            }
        }
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

const addUserToCompany = async (userId: string, companyId: string) => {
    const user = await userService.getUserById(userId)

    const company = await getCompanyById(companyId)

    try {
        const newCompanyUser = await prisma.company_users.create({
            data: {
                usr_id: user.usr_id,
                cmp_id: company.cmp_id
            }
        })

        return newCompanyUser
    } catch (error) {
        throw new InternalServerError(LNG078)
    }
}

const getCompaniesByUserId = async (userId: string) => {
    const user = await userService.getUserById(userId)

    try {
        const userCompanies = await prisma.company_users.findMany({
            where: {
                usr_id: user.usr_id
            }
        })

        const companyIds = userCompanies.map(company => company.cmp_id)

        const companies = await prisma.companies.findMany({
            where: {
                cmp_id: {
                    in: companyIds
                }
            }
        })

        return companies
    } catch (error) {
        throw new InternalServerError(LNG087)
    }
}

export const companyService = {
    getCompanies,
    getCompanyById,
    getCompanyByUserId,
    getUsersByCompanyId,
    getCompaniesByUserId,
    createCompany,
    updateCompany,
    deleteCompany,
    addUserToCompany
}