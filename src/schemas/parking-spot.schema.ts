import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const parkingSpotSchema = z.object({
    pkl_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    stu_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    pks_number: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
});

export const updateParkingSpotSchema = parkingSpotSchema.partial();

export type ParkingSpotSchema = z.infer<typeof parkingSpotSchema>;
export type UpdateParkingSpotSchema = z.infer<typeof updateParkingSpotSchema>;
