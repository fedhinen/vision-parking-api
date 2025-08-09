import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const parkingSpotConfigSchema = z.object({
    esp32_id: z.string(ERROR_CATALOG.validation.VAL001.message).
        regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, ERROR_CATALOG.validation.VAL015)
});