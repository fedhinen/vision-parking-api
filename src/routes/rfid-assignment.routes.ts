import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { rfidAssignmentController } from "../controllers/rfid-assignment.controller";

const router = Router();

router.post("/rfid-assignments", authenticate, rfidAssignmentController.createRfidAssigment)
router.get("/rfid-assignments/:id", authenticate, rfidAssignmentController.getRfidAssignmentById)
router.put("/rfid-assignments/:id", authenticate, rfidAssignmentController.updateRfidAssignment)
router.delete("/rfid-assignments/:id", authenticate, rfidAssignmentController.deleteRfidAssignment)

export const rfidAssignmentsRoutes = router;