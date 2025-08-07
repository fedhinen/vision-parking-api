import { Router } from "express";
import { userRoutes } from "./user.routes";
import { companyRoutes } from "./company.routes";
import { vehicleRoutes } from "./vehicle.routes";
import { parkingLotRoutes } from "./parking-lot.routes";
import { parkingSpotRoutes } from "./parking-spot.routes";
import { clientRoutes } from "./client.routes";
import { spotAssignmentsRoutes } from "./spot-assignment.routes";
import { reservationRoutes } from "./reservation.routes";
import { rfidAssignmentsRoutes } from "./rfid-assignment.routes";
import { companyAccessRequestRoutes } from "./company-access-request.routes";
import { filesRoutes } from "./file.routes";
import { testRouter } from "./test.routes";
import { rfidTagRoutes } from "./rfid-tag.routes";

export const router = Router();

router.use(userRoutes)
router.use(clientRoutes)
router.use(companyRoutes)
router.use(vehicleRoutes)
router.use(parkingLotRoutes)
router.use(parkingSpotRoutes)
router.use(spotAssignmentsRoutes)
router.use(reservationRoutes)
router.use(rfidAssignmentsRoutes)
router.use(companyAccessRequestRoutes)
router.use(filesRoutes)
router.use("/test", testRouter)
router.use(rfidTagRoutes)