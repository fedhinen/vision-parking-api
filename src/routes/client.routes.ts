import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { clientController } from "../controllers/client.controller";

const router = Router();

router.post("/clients", authenticate, clientController.createClient)
router.get("/clients/:id", authenticate, clientController.getClientById)
router.put("/clients/:id", authenticate, clientController.updateClient)
router.delete("/clients/:id", authenticate, clientController.deleteClient)

export const clientRoutes = router;