import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const companySchema = z.object({
    cmp_name: z.string(ERROR_CATALOG.validation.VAL001),
}) 