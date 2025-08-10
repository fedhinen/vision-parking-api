import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { reservationController } from "../controllers/reservation.controller";

const router = Router();

router.post("/reservations", authenticate, reservationController.createReservation)
router.get("/reservations/:id", authenticate, reservationController.getReservationById)
router.put("/reservations/:id", authenticate, reservationController.updateReservation)
router.delete("/reservations/:id", authenticate, reservationController.deleteReservation)

export const reservationRoutes = router;