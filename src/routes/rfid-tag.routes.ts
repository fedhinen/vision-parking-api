import { Router } from "express";
import { rfidTagController } from "../controllers/rfid-tag.controller";

const router = Router();

router.post("/rfid-tags", rfidTagController.createRFIDTag)
router.get("/rfid-tags/:id", rfidTagController.getRFIDTagById);
router.get("/companies/:companyId/rfid-tags", rfidTagController.getRFIDTagsByCompanyId);

export const rfidTagRoutes = router