import { parkingLotService } from "../services/parking-lot.service";
import { parkingSpotService } from "../services/parking-spot.service";
import { prisma } from "./lib/prisma";

const createParkingLot = async (companyId: string) => {
    const parkingLot = await parkingLotService.createParkingLot({
        pkl_name: "Test Parking Lot",
        cmp_id: companyId,
        pkl_created_by: "system",
    })
    console.log("Estacionamiento creado correctamente:", parkingLot);
    return parkingLot
}

const createDefaultParkingSpots = async (parkingLotId: string) => {
    const sections = ["A", "B", "C"];
    const totalPerSection = 10;

    const inactiveStatus = await prisma.status.findFirst({
        where: {
            stu_name: "Inactivo",
            stu_table: "parking_spots"
        }
    })

    for (const section of sections) {
        for (let i = 1; i <= totalPerSection; i++) {
            await parkingSpotService.createParkingSpot({
                pkl_id: parkingLotId,
                stu_id: inactiveStatus?.stu_id,
                pks_number: `${section}${i}`,
                pks_created_by: "system",
            })
        }
    }
    console.log("Lugares de estacionamiento creados correctamente");
}

export const clientConfig = {
    createParkingLot,
    createDefaultParkingSpots
}