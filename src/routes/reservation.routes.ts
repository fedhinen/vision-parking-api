import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { reservationController } from "../controllers/reservation.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/reservations", authenticate, logger, reservationController.createReservation)
router.get("/reservations/:id", authenticate, reservationController.getReservationById)
router.put("/reservations/:id", authenticate, logger, reservationController.updateReservation)
router.delete("/reservations/:id", authenticate, logger, reservationController.deleteReservation)
router.get("/users/:id/reservations", authenticate, reservationController.getReservationsByUserId)

export const reservationRoutes = router;