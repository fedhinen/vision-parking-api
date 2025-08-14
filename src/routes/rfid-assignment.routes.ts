import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { rfidAssignmentController } from "../controllers/rfid-assignment.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.get("/rfid-assignments", authenticate, rfidAssignmentController.getRfidAssignmentByTag)
router.post("/rfid-assignments", authenticate, logger, rfidAssignmentController.createRfidAssigment)
router.get("/rfid-assignments/:id", authenticate, rfidAssignmentController.getRfidAssignmentById)
router.put("/rfid-assignments/:id", authenticate, logger, rfidAssignmentController.updateRfidAssignment)
router.delete("/rfid-assignments/:id", authenticate, logger, rfidAssignmentController.deleteRfidAssignment)
router.get("/companies/:companyId/rfid-assignments", authenticate, rfidAssignmentController.getRfidAssignmentsByCompanyId)

export const rfidAssignmentsRoutes = router;