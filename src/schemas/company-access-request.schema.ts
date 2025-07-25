import z from "zod";

export const companyAccessRequestSchema = z.object({
    usr_id: z.uuid("ID del usuario debe ser un UUID válido"),
    cmp_id: z.uuid("ID de la compañía debe ser un UUID válido"),
    stu_id: z.uuid("ID del estado debe ser un UUID válido"),
    cma_description: z.string().min(1, "Descripción es requerida")
});

export const updateCompanyAccessRequestSchema = companyAccessRequestSchema.partial();

export type CompanyAccessRequestSchema = z.infer<typeof companyAccessRequestSchema>;
export type UpdateCompanyAccessRequestSchema = z.infer<typeof updateCompanyAccessRequestSchema>;
