import z from "zod";

export const parkingSpotSchema = z.object({
    pkl_id: z.uuid("ID del estacionamiento debe ser un UUID válido"),
    stu_id: z.uuid("ID del estado debe ser un UUID válido"),
    pks_number: z.string().min(1, "Número del cajón es requerido")
});

export const updateParkingSpotSchema = parkingSpotSchema.partial();

export type ParkingSpotSchema = z.infer<typeof parkingSpotSchema>;
export type UpdateParkingSpotSchema = z.infer<typeof updateParkingSpotSchema>;
