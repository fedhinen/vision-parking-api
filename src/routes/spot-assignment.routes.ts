import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { spotAssignmentController } from "../controllers/spot-assignment.controller";

const router = Router();

router.post("/spot-assignments", authenticate, spotAssignmentController.createSpotAssigment)
router.get("/spot-assigments/:id", authenticate, spotAssignmentController.getSpotAssignmentById)
router.put("/spot-assigments/:id", authenticate, spotAssignmentController.updateSpotAssigment)
router.delete("/spot-assigments/:id", authenticate, spotAssignmentController.deleteSpotAssignment)

export const spotAssignmentsRoutes = router;