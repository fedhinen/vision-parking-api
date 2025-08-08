import { webSocketService } from '../services/websocket.service'
import { mqttService } from '../services/mqtt.service'

// Exportar los servicios para uso global
export { webSocketService, mqttService }

// Función helper para obtener el cliente WebSocket
export const getWebSocketClient = () => {
    return webSocketService.getIO()
}

// Función helper para enviar notificaciones WebSocket
export const sendWebSocketNotification = (data: { event: string, data: any, room?: string }) => {
    const { event, data: payload, room } = data
    if (room) {
        webSocketService.broadcast({
            event,
            data: payload,
            room
        })
    } else {
        webSocketService.broadcast({
            event,
            data
        })
    }
}
