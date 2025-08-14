import { Router } from "express";
import { companyController } from "../controllers/company.controller";
import { authenticate } from "../middleware/authenticate";
import { logger } from "../middleware/logger";

const router = Router();

router.get("/companies", authenticate, companyController.getCompanies)
router.post("/companies", authenticate, logger, companyController.createCompany)
router.get("/companies/:id", authenticate, companyController.getCompanyById)
router.put("/companies/:id", authenticate, logger, companyController.updateCompany)
router.delete("/companies/:id", authenticate, logger, companyController.deleteCompany)
router.get("/companies/:id/users", authenticate, companyController.getUsersByCompanyId)
router.get("/users/:id/companies", authenticate, companyController.getCompaniesByUserId)

export const companyRoutes = router;