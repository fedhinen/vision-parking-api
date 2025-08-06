import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const rfidTagSchema = z.object({
    rft_tag: z.string(ERROR_CATALOG.validation.VAL001.message),
    cmp_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
})