import z from "zod";

export const rfidAssignmentSchema = z.object({
    rft_id: z.uuid("ID del tag RFID debe ser un UUID válido"),
    usr_id: z.uuid("ID del usuario debe ser un UUID válido")
});

export const updateRfidAssignmentSchema = rfidAssignmentSchema.partial();

export type RfidAssignmentSchema = z.infer<typeof rfidAssignmentSchema>;
export type UpdateRfidAssignmentSchema = z.infer<typeof updateRfidAssignmentSchema>;
