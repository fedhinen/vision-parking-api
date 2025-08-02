import { prisma } from "../src/utils/lib/prisma";

const ESTATUS = [
    {
        stu_name: "Activo",
        stu_table: "parking_spots",
        stu_description: "El estado activo indica que el lugar de estacionamiento está disponible para ser utilizado.",
    },
    {
        stu_name: "Ocupado",
        stu_table: "parking_spots",
        stu_description: "El estado ocupado indica que el lugar de estacionamiento está actualmente en uso.",
    },
    {
        stu_name: "Reservado",
        stu_table: "parking_spots",
        stu_description: "El estado reservado indica que el lugar de estacionamiento ha sido reservado para un usuario específico.",
    },
    {
        stu_name: "Inactivo",
        stu_table: "parking_spots",
        stu_description: "El estado de inactivo indica que el lugar de estacionamiento no está configurado para ser utilizado en este momento.",
    }
]

const main = async () => {
    try {
        await createDefaultStatus();
        console.log("Datos de prueba creados correctamente");
    } catch (error) {
        console.error("Error al crear datos de prueba:", error);
    }
}

const createDefaultStatus = async () => {
    await prisma.status.createMany({
        data: ESTATUS,
    })
    console.log("Estatus creados correctamente");
}

main()