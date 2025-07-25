import z from "zod";
import { ERROR_CATALOG } from "../utils/error-catalog";

export const reservationSchema = z.object({
    usr_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    pks_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    stu_id: z.uuid(ERROR_CATALOG.validation.VAL002.message),
    rsv_initial_date: z.date(ERROR_CATALOG.validation.VAL009.message),
    rsv_end_date: z.date(ERROR_CATALOG.validation.VAL009.message),
    rsv_reason: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(1, ERROR_CATALOG.validation.VAL007.message(1))
}).refine((data) => data.rsv_end_date > data.rsv_initial_date, {
    message: "La fecha final debe ser posterior a la fecha inicial",
    path: ["rsv_end_date"]
});

export const updateReservationSchema = reservationSchema.partial();

export type ReservationSchema = z.infer<typeof reservationSchema>;
export type UpdateReservationSchema = z.infer<typeof updateReservationSchema>;
