import z from "zod";

export const clientSchema = z.object({
    cte_name: z.string().min(1, "Nombre del cliente es requerido"),
    cte_phone: z.string().min(1, "Teléfono es requerido"),
    cte_email: z.email("Formato de email inválido"),
    cte_address: z.string().min(1, "Dirección es requerida"),
    cte_zipcode: z.string().min(1, "Código postal es requerido"),
    cmp_id: z.uuid("ID de compañía debe ser un UUID válido")
});

export const updateClientSchema = clientSchema.partial();

export type ClientSchema = z.infer<typeof clientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
