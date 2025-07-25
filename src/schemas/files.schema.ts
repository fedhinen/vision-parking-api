import { z } from "zod";

export const uploadFileSchema = z.object({
    body: z.object({
        fil_relation_id: z.string({
            message: "fil_relation_id es requerido y debe ser una cadena"
        }).min(1, "fil_relation_id no puede estar vacío")
    })
});

export const fileIdSchema = z.object({
    params: z.object({
        id: z.uuid({
            message: "ID del archivo es requerido y debe ser un UUID"
        })
    })
});

export type UploadFileBody = z.infer<typeof uploadFileSchema>["body"];
export type FileIdParams = z.infer<typeof fileIdSchema>["params"];
