import { Request, Response, NextFunction } from "express";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { AuthError } from "./error/error";
import { prisma } from "../utils/lib/prisma";
import jwt from "jsonwebtoken";
import { userService } from "../services/user.service";

const {
    AUTH004,
    AUTH015,
    AUTH018
} = ERROR_CATALOG.autentication

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const header = req.headers.authorization;
        const apikeyHeader = req.headers['api-key-access'];

        if (apikeyHeader) {
            if (apikeyHeader !== process.env.API_KEY_ACCESS) {
                throw new AuthError(AUTH018);
            }

            return next();
        }

        if (!header || !header.startsWith("Bearer ")) {
            throw new AuthError(AUTH015);
        }

        const token = header.replace("Bearer ", "");

        const tokenExist = await prisma.tokens.findFirst({
            where: {
                tok_token: token,
            },
        });

        if (!tokenExist) {
            throw new AuthError(AUTH004);
        }

        jwt.verify(token, process.env.JWT_KEY || "");

        const user = await userService.getUserById(tokenExist.usr_id)
        req.user = {
            usr_id: user.usr_id,
            usr_email: user.usr_email,
            usr_name: user.usr_name
        };
        next();
    } catch (error) {
        next(error);
    }
};