import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { parkingSpotController } from "../controllers/parking-spot.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/parking-spots", authenticate, logger, parkingSpotController.createParkingSpot)
router.get("/parking-spots/:id", authenticate, parkingSpotController.getParkingSpotById)
router.put("/parking-spots/:id", authenticate, logger, parkingSpotController.updateParkingSpot)
router.delete("/parking-spots/:id", authenticate, logger, parkingSpotController.deleteParkingSpot)
router.post("/parking-spots/:id/config", authenticate, logger, parkingSpotController.configParkingSpot);
router.get("/parking-spots/config/:id", authenticate, parkingSpotController.getParkingSpotConfig);

export const parkingSpotRoutes = router;