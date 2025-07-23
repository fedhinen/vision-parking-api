import { NextFunction, Request, Response } from "express";
import { HttpError, ValidationError } from "./error";

export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {
    if(err instanceof HttpError){
        const errorMessage = err.message
        const errorStatus = err.status

        return res.status(errorStatus).json({
            message: errorMessage
        });
    }

    if(err instanceof ValidationError){
        return res.status(err.status).json({
            errors:err.errors
        })
    }

    else{
        return res.status(500).json({message:"Error no controlado"})
    }
}