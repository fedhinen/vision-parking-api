import z from 'zod'
import { ERROR_CATALOG } from '../utils/error-catalog'

export const userSchema = z.object({
    usr_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(5, ERROR_CATALOG.validation.VAL007.message(5))
        .max(30, ERROR_CATALOG.validation.VAL008.message(30)),
    usr_email: z.email(ERROR_CATALOG.validation.VAL010.message)
        .min(10, ERROR_CATALOG.validation.VAL007.message(5))
        .max(45, ERROR_CATALOG.validation.VAL008.message(45)),
    usr_password: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(12, ERROR_CATALOG.validation.VAL007.message(12))
        .max(32, ERROR_CATALOG.validation.VAL008.message(32)),
    pry_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .refine((val) => ['VISION_PARKING_WEB', 'VISION_PARKING_DESKTOP', 'VISION_PARKING_MOVIL'].includes(val),
            {
                message: ERROR_CATALOG.validation.VAL012.message
            }
        )
})

export const signinSchema = userSchema.pick({
    usr_email: true,
    usr_password: true
})