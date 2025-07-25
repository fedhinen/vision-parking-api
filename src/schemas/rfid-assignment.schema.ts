import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const rfidAssignmentSchema = z.object({
    rft_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    usr_id: z.uuid(ERROR_CATALOG.validation.VAL002.message)
});

export const updateRfidAssignmentSchema = rfidAssignmentSchema.partial();

export type RfidAssignmentSchema = z.infer<typeof rfidAssignmentSchema>;
export type UpdateRfidAssignmentSchema = z.infer<typeof updateRfidAssignmentSchema>;
