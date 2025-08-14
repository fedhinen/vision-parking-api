import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { spotAssignmentController } from "../controllers/spot-assignment.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/spot-assignments", authenticate, logger, spotAssignmentController.createSpotAssigment)
router.get("/spot-assignments/:id", authenticate, spotAssignmentController.getSpotAssignmentById)
router.put("/spot-assignments/:id", authenticate, logger, spotAssignmentController.updateSpotAssigment)
router.delete("/spot-assignments/:id", authenticate, logger, spotAssignmentController.deleteSpotAssignment)
router.get("/parking-spots/:spotId/spot-assignments", authenticate, spotAssignmentController.getActiveSpotAssignment)

export const spotAssignmentsRoutes = router;