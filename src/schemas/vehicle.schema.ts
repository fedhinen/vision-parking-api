import z from "zod";

export const vehicleSchema = z.object({
    veh_plate: z.string().min(1, "Placa del vehículo es requerida"),
    veh_brand: z.string().min(1, "Marca del vehículo es requerida"),
    veh_model: z.string().min(1, "Modelo del vehículo es requerido"),
    veh_color: z.string().min(1, "Color del vehículo es requerido"),
    veh_year: z.number().int().min(1900, "Año debe ser mayor a 1900").max(new Date().getFullYear() + 1, "Año no puede ser futuro")
});

export const updateVehicleSchema = vehicleSchema.partial();

export type VehicleSchema = z.infer<typeof vehicleSchema>;
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>;
