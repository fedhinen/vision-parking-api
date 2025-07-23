import { Router } from "express";
import { companyController } from "../controllers/company.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/companies", authenticate, companyController.createCompany)

export const companyRoutes = router;