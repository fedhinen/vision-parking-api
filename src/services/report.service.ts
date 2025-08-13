import { InternalServerError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { prisma } from "../utils/lib/prisma";
import { companyService } from "./company.service";

const {
    LNG097
} = ERROR_CATALOG.businessLogic

const vehiclesCompanyReport = async (companyId: string, filters: any) => {
    const {
        veh_color,
        veh_model,
        veh_brand,
        veh_year,
        veh_plate,
        veh_active,
        usr_id
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.vehicles.findMany({
            where: {
                company_id: company.cmp_id,
                ...(veh_color && { veh_color }),
                ...(veh_model && { veh_model }),
                ...(veh_brand && { veh_brand }),
                ...(veh_year && { veh_year }),
                ...(veh_plate && { veh_plate }),
                ...(veh_active !== undefined && { veh_active }),
                ...(usr_id && { usr_id })
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
        rsv_initial_date,
        rsv_end_date,
        stu_id,
        usu_id
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.reservations.findMany({
            where: {
                company_id: company.cmp_id,
                ...(rsv_initial_date && { rsv_initial_date }),
                ...(rsv_end_date && { rsv_end_date }),
                ...(stu_id && { stu_id }),
                ...(usu_id && { usu_id })
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
        pks_id,
        stu_id,
        usr_id,
        initial_date,
        end_date
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.parking_spots.findMany({
            where: {
                company_id: company.cmp_id,
                ...(pks_id && { pks_id }),
                ...(stu_id && { stu_id }),
                ...(usr_id && { usr_id }),
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