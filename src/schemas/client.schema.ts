import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const clientSchema = z.object({
    cte_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    cte_phone: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    cte_email: z.email(ERROR_CATALOG.validation.VAL010.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    cte_address: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    cte_zipcode: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1)),
    cmp_id: z.uuid(ERROR_CATALOG.validation.VAL002.message)
});

export const updateClientSchema = clientSchema.partial();

export type ClientSchema = z.infer<typeof clientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
