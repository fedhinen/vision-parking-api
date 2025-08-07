import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.post("/signup", userController.signup)
router.post("/signin", userController.signin);
router.post("/verify", userController.verifyCode);
router.post("/signup/desktop/:cmp_id", userController.createDesktopUser)
router.post("/configurated/:usr_id", userController.movilUserConfigurated)

export const userRoutes = router;