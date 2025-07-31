import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const vehicleSchema = z.object({
    veh_plate: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
        .regex(/^[A-Z]{3}-\d{3}-[A-Z]$/, ERROR_CATALOG.validation.VAL011.message),
    veh_brand: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    veh_model: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    veh_color: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    veh_year: z.number(ERROR_CATALOG.validation.VAL002.message)
        .int()
        .min(1900, "Año debe ser mayor a 1900")
        .max(new Date().getFullYear() + 1, "Año no puede ser futuro")
});

export const updateVehicleSchema = vehicleSchema.partial();

export type VehicleSchema = z.infer<typeof vehicleSchema>;
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>;
