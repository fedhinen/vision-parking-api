import { z } from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const uploadFileSchema = z.object({
    body: z.object({
        fil_relation_id: z.string(ERROR_CATALOG.validation.VAL001.message)
            .min(1, ERROR_CATALOG.validation.VAL007.message(1))
    })
});

export const fileIdSchema = z.object({
    params: z.object({
        id: z.uuid(ERROR_CATALOG.validation.VAL002.message)
    })
});

export type UploadFileBody = z.infer<typeof uploadFileSchema>["body"];
export type FileIdParams = z.infer<typeof fileIdSchema>["params"];
