import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { companyAccessRequestController } from "../controllers/company-access-request.controller";

const router = Router();

router.post(
    "/company-access-requests",
    authenticate,
    companyAccessRequestController.createCompanyAccessRequest
)
router.get(
    "/company-access-requests/:id",
    authenticate,
    companyAccessRequestController.getCompanyAccessRequestById
)
router.put(
    "/company-access-requests/:id",
    authenticate,
    companyAccessRequestController.updateCompanyAccessRequest
)
router.delete(
    "/company-access-requests/:id",
    authenticate,
    companyAccessRequestController.deleteCompanyAccessRequest
)

export const companyAccessRequestRoutes = router;