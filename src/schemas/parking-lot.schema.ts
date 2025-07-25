import z from "zod";

export const parkingLotSchema = z.object({
    cmp_id: z.uuid("ID de compañía debe ser un UUID válido"),
    pkl_name: z.string().min(1, "Nombre del estacionamiento es requerido")
});

export const updateParkingLotSchema = parkingLotSchema.partial();

export type ParkingLotSchema = z.infer<typeof parkingLotSchema>;
export type UpdateParkingLotSchema = z.infer<typeof updateParkingLotSchema>;
