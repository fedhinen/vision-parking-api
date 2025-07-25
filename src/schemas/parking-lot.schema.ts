import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const parkingLotSchema = z.object({
    cmp_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    pkl_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
});

export const updateParkingLotSchema = parkingLotSchema.partial();

export type ParkingLotSchema = z.infer<typeof parkingLotSchema>;
export type UpdateParkingLotSchema = z.infer<typeof updateParkingLotSchema>;
