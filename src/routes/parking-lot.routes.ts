import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { parkingLotController } from "../controllers/parking-lot.controller";

const router = Router();

router.post("/parking-lots", authenticate, parkingLotController.createParkingLot)
router.get("/parking-lots/:id", authenticate, parkingLotController.getParkingLotById)
router.put("/parking-lots/:id", authenticate, parkingLotController.updateParkingLot)
router.delete("/parking-lots/:id", authenticate, parkingLotController.deleteParkingLot)
router.get("/companies/:id/parking-lots", authenticate, parkingLotController.getParkingLotsByCompanyId)

export const parkingLotRoutes = router;