import z from 'zod'
import { ERROR_CATALOG } from '../utils/error-catalog'

export const userSchema = z.object({
    usr_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(4, ERROR_CATALOG.validation.VAL007.message(4))
        .max(30, ERROR_CATALOG.validation.VAL008.message(30)),
    usr_email: z.email(ERROR_CATALOG.validation.VAL010.message)
        .min(10, ERROR_CATALOG.validation.VAL007.message(5))
        .max(45, ERROR_CATALOG.validation.VAL008.message(45)),
    usr_password: z.string(ERROR_CATALOG.validation.VAL001.message)
        .min(10, ERROR_CATALOG.validation.VAL007.message(10))
        .max(32, ERROR_CATALOG.validation.VAL008.message(32))
        .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/.test(
            val
        ),
            {
                message: ERROR_CATALOG.validation.VAL014.message
            }
        ),
    pry_name: z.string(ERROR_CATALOG.validation.VAL001.message)
        .refine((val) => ['VISION_PARKING_WEB', 'VISION_PARKING_DESKTOP', 'VISION_PARKING_MOVIL'].includes(val),
            {
                message: ERROR_CATALOG.validation.VAL012.message
            }
        ),
    cmp_id: z.string().optional()
}).refine((data) => {
    if (data.pry_name === 'VISION_PARKING_DESKTOP' && !data.cmp_id) {
        return false;
    }
    return true;
}, {
    message: ERROR_CATALOG.validation.VAL013.message
})

export const signinSchema = userSchema.pick({
    usr_email: true,
    usr_password: true,
    pry_name: true
})