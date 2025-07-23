import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { signinSchema, userSchema } from "../schemas/user.schema";
import { ValidationError } from "../middleware/error";

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
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const validateCode = async (req: Request, res: Response, next: NextFunction) => {
    const { usr_email, cod_code } = req.body

    try {
        const userValidated = await userService.validateCode(usr_email, cod_code)

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
    signin
}