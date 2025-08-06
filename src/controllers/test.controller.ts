import { NextFunction, Request, Response } from "express"
import { webSocketService, mqttService } from "../utils/global-services"

const testWebSocket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, room } = req.body

        if (room) {
            webSocketService.broadcastToRoom(room, {
                type: 'test_message',
                data: message || 'Test message from API',
                timestamp: new Date().toISOString()
            })
        } else {
            webSocketService.broadcast({
                type: 'test_message',
                data: message || 'Test message from API',
                timestamp: new Date().toISOString()
            })
        }

        res.status(200).json({
            message: "Mensaje WebSocket enviado correctamente",
            data: { message, room }
        })
    } catch (error) {
        next(error)
    }
}

const testMqtt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type = 'test', data } = req.body

        if (type === 'reservation') {
            await mqttService.publishReservationCreated({
                rsv_id: data?.rsv_id || 'test-reservation-id',
                usr_id: data?.usr_id || 'test-user-id',
                pks_id: data?.pks_id || 'test-parking-spot-id',
                // rsv_initial_date: data?.rsv_initial_date || new Date().toISOString(),
                // rsv_end_date: data?.rsv_end_date || new Date(Date.now() + 3600000).toISOString(),
                // rsv_reason: data?.rsv_reason || 'Test reservation',
                status: data?.status || 'Pendiente',
                // user_name: data?.user_name || 'Test User',
                // parking_spot_code: data?.parking_spot_code || 'SPOT-TEST'
            })
        } else if (type === 'status') {
            await mqttService.publishReservationStatusChanged({
                rsv_id: data?.rsv_id || 'test-reservation-id',
                pks_id: data?.pks_id || 'test-parking-spot-id',
                status: data?.status || 'Aceptada',
                action: data?.action || 'accepted'
            })
        }

        res.status(200).json({
            message: "Mensaje MQTT enviado correctamente",
            data: { type, data }
        })
    } catch (error) {
        next(error)
    }
}

export const testController = {
    testWebSocket,
    testMqtt
}
