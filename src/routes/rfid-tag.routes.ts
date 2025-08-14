import { Router } from "express";
import { rfidTagController } from "../controllers/rfid-tag.controller";
import { authenticate } from "../middleware/authenticate";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/rfid-tags", authenticate, logger, rfidTagController.createRFIDTag)
router.get("/rfid-tags/:id", authenticate, rfidTagController.getRFIDTagById);
router.get("/companies/:companyId/rfid-tags", authenticate, rfidTagController.getRFIDTagsByCompanyId);

export const rfidTagRoutes = router