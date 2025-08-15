import z from 'zod'
import { ERROR_CATALOG } from '../utils/error-catalog'

export const passwordResetSchema = z.object({
    usr_email: z.email(ERROR_CATALOG.validation.VAL010.message)
        .min(10, ERROR_CATALOG.validation.VAL007.message(5))
        .max(45, ERROR_CATALOG.validation.VAL008.message(45))
})