import { InternalServerError } from "../middleware/error/error";
import { ERROR_CATALOG } from "./error-catalog";
import { prisma } from "./lib/prisma";

export const userActionLogger = async (body: any) => {
    const {
        log_table_name,
        log_field_id,
        log_body,
        log_action,
        log_response,
        log_created_by
    } = body;

    try {
        await prisma.log_actions.create({
            data: {
                log_table_name,
                log_field_id,
                log_body,
                log_action,
                log_response,
                log_created_by
            }
        })
    } catch (error) {
        console.log(error)
        throw new InternalServerError(ERROR_CATALOG.businessLogic.LNG098)
    }
}