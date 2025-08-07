import { Router } from "express";
import { companyController } from "../controllers/company.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.get("/companies", authenticate, companyController.getCompanies)
router.post("/companies", authenticate, companyController.createCompany)
router.get("/companies/:id", authenticate, companyController.getCompanyById)
router.put("/companies/:id", authenticate, companyController.updateCompany)
router.delete("/companies/:id", authenticate, companyController.deleteCompany)
router.get("/companies/:id/users", authenticate, companyController.getUsersByCompanyId)
router.get("/users/:id/companies", authenticate, companyController.getCompaniesByUserId)

export const companyRoutes = router;