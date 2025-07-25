import { Router } from "express";
import { userRoutes } from "./user.routes";
import { companyRoutes } from "./company.routes";
import { filesRoutes } from "./files.routes";

export const router = Router();

router.use(userRoutes)
router.use(companyRoutes)
router.use("/files", filesRoutes)