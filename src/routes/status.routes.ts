import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { statusController } from "../controllers/status.controller";

const router = Router();

router.get("/status", authenticate, statusController.getStatusByTableAndName)

export const statusRoutes = router;