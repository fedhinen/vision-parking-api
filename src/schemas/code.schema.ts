import z from "zod"
import { ERROR_CATALOG } from "../utils/error-catalog";

export const verifyCodeSchema = z.object({
    usr_id: z.string(ERROR_CATALOG.validation.VAL001.message),
    cod_code: z.number(ERROR_CATALOG.validation.VAL002.message)
})