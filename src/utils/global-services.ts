import { webSocketService } from '../services/websocket.service'
import { mqttService } from '../services/mqtt.service'

// Exportar los servicios para uso global
export { webSocketService, mqttService }

// Función helper para obtener el cliente WebSocket
export const getWebSocketClient = () => {
    return webSocketService.getIO()
}

// Función helper para enviar notificaciones WebSocket
export const sendWebSocketNotification = (type: string, data: any, room?: string) => {
    const message = {
        type,
        data,
        timestamp: new Date().toISOString()
    }

    if (room) {
        webSocketService.broadcastToRoom(room, message)
    } else {
        webSocketService.broadcast(message)
    }
}
