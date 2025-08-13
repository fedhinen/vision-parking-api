import { NextFunction, Request, Response } from "express";
import { userActionLogger } from "../utils/logger";

export const logger = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next();
    }

    if (req.method === 'GET') {
        return next();
    }

    const user = req.user

    const oldSend = res.send.bind(res)
    let responseBody: any

    res.send = function (body?: any) {
        responseBody = body
        return oldSend(body)
    }

    res.on('finish', async () => {
        let bodyParsed: any = responseBody;

        if (typeof responseBody === 'string') {
            try {
                bodyParsed = JSON.parse(responseBody);
            } catch {
                bodyParsed = responseBody;
            }
        }

        try {
            await userActionLogger({
                log_table_name: res.locals.tableName || "",
                log_field_id: req.params.id || res.locals.newId || "",
                log_body: req.body,
                log_action: req.method,
                log_response: JSON.parse(responseBody),
                log_created_by: user?.usr_name || ""
            })
        } catch (error) {
            console.log(error)
        }
    })

    next()
}