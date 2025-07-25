import { Router } from "express";
import { companyController } from "../controllers/company.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/companies", authenticate, companyController.createCompany)
router.get("/companies/:id", authenticate, companyController.getCompanyById)
router.put("/companies/:id", authenticate, companyController.updateCompany)
router.delete("/companies/:id", authenticate, companyController.deleteCompany)

export const companyRoutes = router;