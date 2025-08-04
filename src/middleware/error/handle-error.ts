import { NextFunction, Request, Response } from "express";
import { HttpError, ValidationError } from "../error/error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const errorMessage = err.message
        const errorStatus = err.status
        const errorCode = err.code

        return res.status(errorStatus).json({
            code: errorCode,
            message: errorMessage
        });
    }

    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            errors: err.errors
        })
    }

    else {
        console.log(err)
        return res.status(500).json({ message: "Error no controlado" })
    }
}