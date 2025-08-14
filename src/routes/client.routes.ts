import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { clientController } from "../controllers/client.controller";
import { logger } from "../middleware/logger";

const router = Router();

router.post("/clients", authenticate, logger, clientController.createClient)
router.get("/clients/:id", authenticate, clientController.getClientById)
router.put("/clients/:id", authenticate, logger, clientController.updateClient)
router.delete("/clients/:id", authenticate, logger, clientController.deleteClient)

export const clientRoutes = router;