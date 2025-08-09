import { prisma } from "../src/utils/lib/prisma";

const ESTATUS = [
    {
        stu_name: "Disponible",
        stu_table: "parking_spots",
        stu_description: "El estado disponible indica que el lugar de estacionamiento está disponible para ser utilizado.",
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
    },
    {
        stu_name: "Pendiente",
        stu_table: "company_access_requests",
        stu_description: "El estado pendiente indica que la solicitud de acceso a la empresa está en espera de revisión.",
    },
    {
        stu_name: "Aceptada",
        stu_table: "company_access_requests",
        stu_description: "El estado aceptada indica que la solicitud de acceso a la empresa ha sido aprobada.",
    },
    {
        stu_name: "Rechazada",
        stu_table: "company_access_requests",
        stu_description: "El estado rechazada indica que la solicitud de acceso a la empresa ha sido denegada.",
    },
    {
        stu_name: "Pendiente",
        stu_table: "reservations",
        stu_description: "El estado pendiente indica que la reserva está en espera de revision.",
    },
    {
        stu_name: "Aceptada",
        stu_table: "reservations",
        stu_description: "El estado aceptada indica que la reserva ha sido aceptada",
    },
    {
        stu_name: "Rechazada",
        stu_table: "reservations",
        stu_description: "El estado rechazada indica que la reserva ha sido rechazada.",
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