import z from "zod";

export const reservationSchema = z.object({
    usr_id: z.uuid("ID del usuario debe ser un UUID válido"),
    pks_id: z.uuid("ID del cajón debe ser un UUID válido"),
    stu_id: z.uuid("ID del estado debe ser un UUID válido"),
    rsv_initial_date: z.date(),
    rsv_end_date: z.date(),
    rsv_reason: z.string().min(1, "Razón de la reserva es requerida")
}).refine((data) => data.rsv_end_date > data.rsv_initial_date, {
    message: "La fecha final debe ser posterior a la fecha inicial",
    path: ["rsv_end_date"]
});

export const updateReservationSchema = reservationSchema.partial();

export type ReservationSchema = z.infer<typeof reservationSchema>;
export type UpdateReservationSchema = z.infer<typeof updateReservationSchema>;
