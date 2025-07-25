import z from "zod";

export const spotAssignmentSchema = z.object({
    pks_id: z.uuid("ID del cajón debe ser un UUID válido"),
    usr_id: z.uuid("ID del usuario debe ser un UUID válido")
});

export const updateSpotAssignmentSchema = spotAssignmentSchema.partial();

export type SpotAssignmentSchema = z.infer<typeof spotAssignmentSchema>;
export type UpdateSpotAssignmentSchema = z.infer<typeof updateSpotAssignmentSchema>;
