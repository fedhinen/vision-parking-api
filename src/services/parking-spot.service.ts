
import { prisma } from "../utils/lib/prisma";
import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { parkingLotService } from "./parking-lot.service";
import { statusService } from "./status.service";
import { webSocketService } from "./websocket.service";

const {
    LNG049,
    LNG048,
    LNG050,
    LNG033,
    LNG071,
    LNG089,
    LNG090,
    LNG091,
    LNG092
} = ERROR_CATALOG.businessLogic

const getParkingSpotsByLotId = async (parkingLotId: string) => {
    const parkingLot = await parkingLotService.getParkingLotById(parkingLotId);

    try {
        const parkingSpots = await prisma.parking_spots.findMany({
            where: {
                pkl_id: parkingLot.pkl_id
            },
            include: {
                status: true,
                reservations: {
                    where: {
                        rsv_end_date: {
                            gte: new Date()
                        }
                    }
                },
                spot_assignments: {
                    where: {
                        spa_active: true
                    },
                    include: {
                        user: true
                    }
                }
            }
        });
        return parkingSpots;
    } catch (error) {
        throw new InternalServerError(LNG071);
    }
}

const createParkingSpot = async (body: any) => {
    const {
        pkl_id,
        stu_id,
        pks_number,
        pks_order
    } = body

    try {
        const newParkingSpot = await prisma.parking_spots.create({
            data: {
                pkl_id: pkl_id,
                stu_id: stu_id,
                pks_number: pks_number,
                pks_order: pks_order,
                pks_created_by: "system"
            },
            include: {
                status: true
            }
        });
        return newParkingSpot;
    } catch (error) {
        console.log("parkingSpotError", error);
        throw new InternalServerError(LNG048);
    }
}

const getParkingSpotById = async (parkingSpotId: string) => {
    try {
        const parkingSpot = await prisma.parking_spots.findUnique({
            where: {
                pks_id: parkingSpotId
            },
            include: {
                status: {
                    select: {
                        stu_name: true
                    }
                },
                reservations: {
                    include: {
                        status: {
                            select: {
                                stu_name: true
                            }
                        }
                    }
                },
                spot_assignments: {
                    where: {
                        spa_active: true
                    },
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!parkingSpot) {
            throw new NotFoundError(LNG049);
        }

        return parkingSpot;
    } catch (error) {
        throw error;
    }
}

const updateParkingSpot = async (parkingSpotId: string, body: any) => {
    const parkingSpot = await getParkingSpotById(parkingSpotId);

    try {
        const updatedParkingSpot = await prisma.parking_spots.update({
            where: {
                pks_id: parkingSpot.pks_id
            },
            data: body,
            include: {
                status: true
            }
        });

        try {
            webSocketService.broadcast({
                event: "backend:parking_spot_updated",
                data: {
                    pks_id: updatedParkingSpot.pks_id,
                    status: {
                        stu_name: updatedParkingSpot.status.stu_name
                    }
                },
                room: `pks_${updatedParkingSpot.pks_id}`
            })
        } catch (error) {
            console.log("Error en el websocket tratando de actualizar un parking spot", error);
        }

        return updatedParkingSpot;
    } catch (error) {
        console.log("updateParkingSpotError", error);
        throw new InternalServerError(LNG050);
    }
}

const deleteParkingSpot = async (parkingSpotId: string) => {
    const parkingSpot = await getParkingSpotById(parkingSpotId);

    try {
        await prisma.spot_assignments.updateMany({
            where: {
                pks_id: parkingSpot.pks_id
            },
            data: {
                spa_active: false
            }
        });

        // For this model, we don't have an "active" field, so we might need to delete directly
        // or handle it differently based on business logic
        await prisma.parking_spots.delete({
            where: {
                pks_id: parkingSpot.pks_id
            }
        });
    } catch (error) {
        throw new InternalServerError(LNG033);
    }
}

const configParkingSpot = async (parkingSpotId: string, body: any) => {
    const {
        esp32_id
    } = body

    try {
        const esp32Configured = await prisma.parking_spots_config.findFirst({
            where: {
                esp32_id
            }
        })

        if (esp32Configured) {
            throw new InternalServerError(LNG091);
        }
    } catch (error) {
        throw error
    }

    const parkingSpot = await getParkingSpotById(parkingSpotId)

    if (parkingSpot.pks_configured) {
        throw new InternalServerError(LNG092);
    }

    const statusDisponible = await statusService.getStatusByTableAndName("parking_spots", "Disponible");

    try {
        const { configSpot, updatedParkingSpot } = await prisma.$transaction(async (tx) => {
            const configSpot = await prisma.parking_spots_config.create({
                data: {
                    pks_id: parkingSpot.pks_id,
                    esp32_id: esp32_id
                }
            })

            const updatedParkingSpot = await prisma.parking_spots.update({
                where: {
                    pks_id: parkingSpot.pks_id
                },
                data: {
                    stu_id: statusDisponible.stu_id,
                    pks_configured: true
                },
                include: {
                    status: {
                        select: {
                            stu_name: true
                        }
                    }
                }
            })

            return {
                configSpot,
                updatedParkingSpot
            }
        })

        try {
            webSocketService.broadcast({
                event: "backend:parking_spot_configured",
                data: {
                    pks_id: updatedParkingSpot.pks_id,
                    status: {
                        stu_name: updatedParkingSpot.status.stu_name
                    }
                },
                room: `pks_${updatedParkingSpot.pks_id}`
            })
        } catch (error) {
            console.error("Error en el websocket tratando de configurar un parking spot", error);
        }

        return configSpot
    } catch (error) {
        throw new InternalServerError(LNG089)
    }
}

const getParkingSpotConfig = async (esp32Id: string) => {
    try {
        const parkingSpotConfig = await prisma.parking_spots_config.findFirst({
            where: {
                esp32_id: esp32Id,
                psc_active: true
            }
        })

        return parkingSpotConfig
    } catch (error) {
        throw new InternalServerError(LNG090);
    }
}

export const parkingSpotService = {
    getParkingSpotsByLotId,
    createParkingSpot,
    getParkingSpotById,
    updateParkingSpot,
    deleteParkingSpot,
    configParkingSpot,
    getParkingSpotConfig
} 