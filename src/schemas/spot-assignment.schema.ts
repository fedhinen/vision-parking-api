import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const spotAssignmentSchema = z.object({
    pks_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    usr_id: z.uuid(ERROR_CATALOG.validation.VAL002.message)
});

export const updateSpotAssignmentSchema = spotAssignmentSchema.partial();

export type SpotAssignmentSchema = z.infer<typeof spotAssignmentSchema>;
export type UpdateSpotAssignmentSchema = z.infer<typeof updateSpotAssignmentSchema>;
