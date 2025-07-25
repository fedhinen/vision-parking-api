import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { parkingSpotController } from "../controllers/parking-spot";

const router = Router();

router.post("/parking-spots", authenticate, parkingSpotController.createParkingSpot)
router.get("/parking-spots/:id", authenticate, parkingSpotController.getParkingSpotById)
router.put("/parking-spots/:id", authenticate, parkingSpotController.updateParkingSpot)
router.delete("/parking-spots/:id", authenticate, parkingSpotController.deleteParkingSpot)

export const parkingSpotRoutes = router;