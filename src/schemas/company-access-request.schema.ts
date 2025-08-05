import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const companyAccessRequestSchema = z.object({
    usr_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    cmp_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    cma_description: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
});

export const updateCompanyAccessRequestSchema = companyAccessRequestSchema.partial();

export type CompanyAccessRequestSchema = z.infer<typeof companyAccessRequestSchema>;
export type UpdateCompanyAccessRequestSchema = z.infer<typeof updateCompanyAccessRequestSchema>;
