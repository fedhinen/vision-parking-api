import { Router } from "express";
import { reportController } from "../controllers/report.controller";

const router = Router();

router.get("/reports/companies/:companyId/vehicles", reportController.vehiclesReport)
router.get("/reports/companies/:companyId/reservations", reportController.reservationsReport)
router.get("/reports/companies/:companyId/parking-spots", reportController.parkingSpotsReport)