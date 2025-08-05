import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { signinSchema, userSchema } from "../schemas/user.schema";
import { ValidationError } from "../middleware/error/error";
import { verifyCodeSchema } from "../schemas/code.schema";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const result = userSchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const newUser = await userService.signup(body)
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    const result = signinSchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const user = await userService.signin(body)
        res.status(200).json({
            message: "Se te ha enviado un codigo de verificacion a tu correo",
            data: {
                usr_id: user.usr_id,
                usr_email: user.usr_email,
            }
        })
    } catch (error) {
        next(error)
    }
}

const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
    const result = verifyCodeSchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        const userValidated = await userService.verifyCode(body)

        res.status(200).json({
            message: "Codigo verificado correctamente",
            tok_token: userValidated.tok_token
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    signup,
    signin,
    verifyCode
}