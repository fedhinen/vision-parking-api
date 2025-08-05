import { Router } from "express"
import { testController } from "../controllers/test.controller"

const testRouter = Router()

testRouter.post("/websocket", testController.testWebSocket)
testRouter.post("/mqtt", testController.testMqtt)

export { testRouter }
