import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { vehicleController } from "../controllers/vehicle.controller";

const router = Router();

router.post("/vehicles", authenticate, vehicleController.createVehicle)
router.get("/vehicles/:id", authenticate, vehicleController.getVehicleById)
router.put("/vehicles/:id", authenticate, vehicleController.updateVehicle)
router.delete("/vehicles/:id", authenticate, vehicleController.deleteVehicle)
router.get("/users/:id/vehicles", authenticate, vehicleController.getUserVehicles)
router.get("/companies/:id/vehicles", authenticate, vehicleController.getCompanyVehicles)

export const vehicleRoutes = router;