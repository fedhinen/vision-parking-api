import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { signinSchema, userSchema } from "../schemas/user.schema";
import { ValidationError } from "../middleware/error/error";
import { verifyCodeSchema } from "../schemas/code.schema";
import { passwordResetSchema } from "../schemas/password-reset.schema";

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

const logout = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.usr_id

    try {
        await userService.logout(String(userId))
        res.status(200).json({
            message: "Sesion cerrada correctamente"
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
            tok_token: userValidated.tok_token,
            usr_id: userValidated.usr_id,
            cmp_id: userValidated.cmp_id,
        })
    } catch (error) {
        next(error)
    }
}

const createDesktopUser = async (req: Request, res: Response, next: NextFunction) => {
    const { cmp_id } = req.params

    try {
        const newUser = await userService.createDesktopUser(cmp_id)
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

const getUserIsConfigurated = async (req: Request, res: Response, next: NextFunction) => {
    const { usr_id } = req.params

    try {
        const isConfigurated = await userService.getUserIsConfigurated(usr_id)
        res.status(200).json({ isConfigurated })
    } catch (error) {
        next(error)
    }
}

const movilUserConfigurated = async (req: Request, res: Response, next: NextFunction) => {
    const { usr_id } = req.params

    try {
        await userService.movilUserConfigurated(usr_id)
        res.status(200).json({
            message: "Usuario configurado correctamente"
        })
    } catch (error) {
        next(error)
    }
}

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const userInfo = await userService.getUserInfo(id)
        res.status(200).json(userInfo)
    } catch (error) {
        next(error)
    }
}

const sendChangePasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
    const result = passwordResetSchema.safeParse(req.body)

    if (!result.success) {
        throw new ValidationError(result.error)
    }

    const body = result.data

    try {
        await userService.sendChangePasswordEmail(body)
        res.status(200).json({
            message: "Se ha enviado un correo para restablecer tu contraseña"
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    getUserInfo,
    signup,
    signin,
    logout,
    verifyCode,
    createDesktopUser,
    movilUserConfigurated,
    getUserIsConfigurated,
    sendChangePasswordEmail
}