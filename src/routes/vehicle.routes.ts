import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { vehicleController } from "../controllers/vehicle.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/vehicles", authenticate, logger, vehicleController.createVehicle)
router.get("/vehicles/:id", authenticate, vehicleController.getVehicleById)
router.put("/vehicles/:id", authenticate, logger, vehicleController.updateVehicle)
router.delete("/vehicles/:id", authenticate, logger, vehicleController.deleteVehicle)
router.get("/users/:id/vehicles", authenticate, vehicleController.getUserVehicles)
router.put("/users/vehicles/:vehicleId", authenticate, logger, vehicleController.setSelectedVehicle)
router.get("/companies/:id/vehicles", authenticate, vehicleController.getCompanyVehicles)

export const vehicleRoutes = router;