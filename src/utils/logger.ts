import { prisma } from "./lib/prisma";

export const logger = async (body: any) => {
    const {
        log_table_name,
        log_field_id,
        log_body,
        log_action,
        log_response,
        log_created_by
    } = body;

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
}