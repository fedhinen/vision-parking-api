import { webSocketService } from '../services/websocket.service'
import { mqttService } from '../services/mqtt.service'

// Exportar los servicios para uso global
export { webSocketService, mqttService }

// Función helper para obtener el cliente WebSocket
export const getWebSocketClient = () => {
    return webSocketService.getIO()
}
