import { InternalServerError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { prisma } from "../utils/lib/prisma";
import { companyService } from "./company.service";

const {
    LNG097
} = ERROR_CATALOG.businessLogic

const vehiclesCompanyReport = async (companyId: string, filters: any) => {
    const {
        color,
        model,
        brand,
        year,
        plate,
        active,
        userId
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.vehicles.findMany({
            where: {
                company_id: company.cmp_id,
                ...(color && { color }),
                ...(model && { model }),
                ...(brand && { brand }),
                ...(year && { year }),
                ...(plate && { plate }),
                ...(active !== undefined && { active }),
                ...(userId && { userId })
            },
            include: {
                user_vehicles: {
                    include: {
                        user: {
                            select: {
                                usr_name: true,
                                usr_email: true
                            }
                        }
                    }
                }
            }
        })

        return data
    } catch (error) {
        throw new InternalServerError(LNG097)
    }
}

const reservationsCompanyReport = async (companyId: string, filters: any) => {
    const {
        initial_date,
        end_date,
        statusId,
        userId
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.reservations.findMany({
            where: {
                company_id: company.cmp_id,
                ...(initial_date && { initial_date }),
                ...(end_date && { end_date }),
                ...(statusId && { statusId }),
                ...(userId && { userId })
            },
            include: {
                user: {
                    select: {
                        usr_name: true,
                        usr_email: true
                    }
                },
                status: {
                    select: {
                        stu_name: true
                    }
                }
            }
        })

        return data
    } catch (error) {
        throw new InternalServerError(LNG097)
    }
}

const parkingSpotsCompanyReport = async (companyId: string, filters: any) => {
    const {
        parkingSpotId,
        statusId,
        userId,
        initial_date,
        end_date
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.parking_spots.findMany({
            where: {
                company_id: company.cmp_id,
                ...(parkingSpotId && { parkingSpotId }),
                ...(statusId && { statusId }),
                ...(userId && { userId }),
                ...(initial_date && { created_at: { gte: new Date(initial_date) } }),
                ...(end_date && { created_at: { lte: new Date(end_date) } })
            },
            include: {
                status: {
                    select: {
                        stu_name: true
                    }
                },
                spot_assignments: {
                    include: {
                        user: {
                            select: {
                                usr_name: true,
                                usr_email: true
                            }
                        }
                    }
                }
            }
        })

        return data
    } catch (error) {
        throw new InternalServerError(LNG097)
    }
}

export const reportService = {
    vehiclesCompanyReport,
    reservationsCompanyReport,
    parkingSpotsCompanyReport
}