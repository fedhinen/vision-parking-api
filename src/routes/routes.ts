import { Router } from "express";
import { userRoutes } from "./user.routes";
import { companyRoutes } from "./company.routes";

export const router = Router();

router.use(userRoutes)
router.use(companyRoutes)