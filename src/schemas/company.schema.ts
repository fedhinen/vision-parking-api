import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const companySchema = z.object({
    cmp_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
});

export const updateCompanySchema = companySchema.partial();

export type CompanySchema = z.infer<typeof companySchema>;
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>; 