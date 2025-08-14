import { endOfMonth, startOfMonth } from "date-fns";
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
                ...(color && { veh_color: color }),
                ...(model && { veh_model: model }),
                ...(brand && { veh_brand: brand }),
                ...(year && { veh_year: year }),
                ...(plate && { veh_plate: { contains: plate } }),
                ...(active !== undefined && { veh_active: active }),
                user_vehicles: {
                    some: {
                        ...(userId && { usr_id: userId }),
                        user: {
                            company_users: {
                                some: {
                                    cmp_id: company.cmp_id
                                }
                            }
                        }
                    }
                }
            },
            include: {
                user_vehicles: {
                    include: {
                        user: {
                            include: {
                                company_users: {
                                    where: {
                                        cmp_id: company.cmp_id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return data
    } catch (error) {
        console.log(error);
        throw new InternalServerError(LNG097)
    }
}

const reservationsCompanyReport = async (companyId: string, filters: any) => {
    const {
        initialDate = startOfMonth(new Date()),
        endDate = endOfMonth(new Date()),
        statusId,
        userId
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.reservations.findMany({
            where: {
                parking_spot: {
                    parking_lot: {
                        cmp_id: company.cmp_id
                    }
                },
                ...(initialDate && { rsv_initial_date: { gte: new Date(initialDate) } }),
                ...(endDate && { rsv_end_date: { lte: new Date(endDate) } }),
                ...(statusId && { stu_id: statusId }),
                ...(userId && { usr_id: userId })
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
        initialDate = startOfMonth(new Date()),
        endDate = endOfMonth(new Date())
    } = filters

    const company = await companyService.getCompanyById(companyId)

    try {
        const data = await prisma.parking_spots.findMany({
            where: {
                parking_lot: {
                    cmp_id: company.cmp_id
                },
                ...(parkingSpotId && { pks_id: parkingSpotId }),
                ...(statusId && { stu_id: statusId }),
                ...(initialDate && { pkl_date: { gte: new Date(initialDate) } }),
                ...(endDate && { pkl_date: { lte: new Date(endDate) } }),
                ...(userId && {
                    spot_assignments: {
                        some: {
                            usr_id: userId,
                            spa_active: true
                        }
                    }
                })
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