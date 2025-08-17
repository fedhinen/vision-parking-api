import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.get("/info/:id", authenticate, userController.getUserInfo);
router.post("/signup", userController.signup)
router.post("/signin", userController.signin);
router.post("/logout", authenticate, userController.logout);
router.post("/verify", userController.verifyCode);
router.post("/password-reset", userController.sendChangePasswordEmail);
router.post("/signup/desktop/:cmp_id", userController.createDesktopUser)
router.get("/configurated/:usr_id", authenticate, userController.getUserIsConfigurated)
router.put("/configurated/:usr_id", authenticate, userController.movilUserConfigurated)

export const userRoutes = router;