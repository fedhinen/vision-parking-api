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
    "/company-access-requests/:id/accept",
    authenticate,
    companyAccessRequestController.acceptCompanyAccessRequest
)
router.put(
    "/company-access-requests/:id/reject",
    authenticate,
    companyAccessRequestController.rejectCompanyAccessRequest
)
router.delete(
    "/company-access-requests/:id",
    authenticate,
    companyAccessRequestController.deleteCompanyAccessRequest
)
router.get(
    "/companies/:companyId/company-access-requests",
    authenticate,
    companyAccessRequestController.getPendingCompanyAccessRequests
)

export const companyAccessRequestRoutes = router;