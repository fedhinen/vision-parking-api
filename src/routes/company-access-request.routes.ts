import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { clientController } from "../controllers/client.controller";

const router = Router();

router.post("/company-access-requests", authenticate, clientController.createClient)
router.get("/company-access-requests/:id", authenticate, clientController.getClientById)
router.put("/company-access-requests/:id", authenticate, clientController.updateClient)
router.delete("/company-access-requests/:id", authenticate, clientController.deleteClient)

export const companyAccessRequestRoutes = router;