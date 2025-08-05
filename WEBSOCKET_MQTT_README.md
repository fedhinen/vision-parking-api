# Vision Parking - WebSocket y MQTT Integration

## Resumen de los cambios implementados

### 1. Servidor WebSocket
- Se configuró Socket.IO en el servidor API
- El servidor ahora soporta conexiones WebSocket en el mismo puerto que la API HTTP
- Los clientes pueden unirse a salas específicas para recibir notificaciones dirigidas

### 2. Servicio MQTT
- Se implementó un cliente MQTT que se conecta automáticamente al broker
- Se añadieron métodos para publicar mensajes de reservas al broker
- Los mensajes siguen la estructura "emisor:evento:receptor"

### 3. Notificaciones en tiempo real
- Cuando se crea una reserva, se envían automáticamente:
  - Notificación WebSocket a todos los clientes conectados
  - Mensaje MQTT al broker para que lo reenvíe a los sensores
- Cuando cambia el estado de una reserva (aceptada/rechazada), se envían las mismas notificaciones

### 4. Broker actualizado
- El broker ahora escucha los mensajes del API
- Reenvía automáticamente los mensajes a los sensores correspondientes
- Maneja tanto notificaciones generales como específicas por parking spot

## Estructura de tópicos MQTT

### Del API al Broker:
- `api:reservation_created:broker` - Nueva reserva creada
- `api:reservation_status_changed:broker` - Estado de reserva cambiado

### Del Broker a los Sensores:
- `broker:reservation_notification:sensor` - Notificación general de reserva
- `broker:reservation_notification:sensor/{pks_id}` - Notificación específica por parking spot
- `broker:status_update:sensor` - Actualización general de estado
- `broker:status_update:sensor/{pks_id}` - Actualización específica por parking spot
- `broker:status_update:sensor/{pks_id}/command` - Comandos específicos al sensor

## Uso de WebSocket

### Conexión del cliente:
```javascript
const socket = io('http://localhost:3000')

// Escuchar mensajes generales
socket.on('message', (data) => {
  console.log('Mensaje recibido:', data)
})

// Unirse a sala específica de usuario
socket.emit('join_room', 'user:USER_ID')

// Unirse a sala específica de parking spot
socket.emit('join_room', 'parking_spot:PARKING_SPOT_ID')
```

### Tipos de mensajes WebSocket:
- `reservation_created` - Nueva reserva creada
- `reservation_status_changed` - Estado de reserva cambiado
- `test_message` - Mensaje de prueba

## Variables de entorno

Añade estas variables a tu archivo `.env`:

```env
# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost
MQTT_BROKER_PORT=1883
```

## Endpoints de prueba

### Probar WebSocket:
```bash
POST /api/test/websocket
{
  "message": "Hello WebSocket!",
  "room": "user:123" // opcional
}
```

### Probar MQTT:
```bash
POST /api/test/mqtt
{
  "type": "reservation", // o "status"
  "data": {
    "rsv_id": "test-id",
    "usr_id": "user-id",
    "pks_id": "parking-spot-id",
    // ... otros campos
  }
}
```

## Servicios expuestos globalmente

Los servicios están disponibles a través de `/src/utils/global-services.ts`:

```typescript
import { webSocketService, mqttService, getWebSocketClient, sendWebSocketNotification } from '../utils/global-services'

// Enviar notificación WebSocket desde cualquier controlador
sendWebSocketNotification('custom_event', { data: 'example' }, 'room_name')

// Acceder al cliente WebSocket directamente
const io = getWebSocketClient()
```

## Flujo completo del sistema

1. **Usuario crea reserva** → API recibe request
2. **Servicio crea reserva** → Base de datos actualizada
3. **Publicación MQTT** → Mensaje enviado al broker
5. **Broker procesa** → Mensaje reenviado a sensores específicos
6. **Sensores reciben** → Dispositivos actualizan su estado

## Ejemplo de mensajes

### Mensaje MQTT de reserva creada:
```json
{
  "rsv_id": "uuid-reservation",
  "usr_id": "uuid-user",
  "pks_id": "uuid-parking-spot",
  "rsv_initial_date": "2025-08-05T10:00:00Z",
  "rsv_end_date": "2025-08-05T12:00:00Z",
  "rsv_reason": "Cita médica",
  "status": "Pendiente",
  "user_name": "Juan Pérez",
  "parking_spot_code": "A-001"
}
```

## Manejo de errores

- Los errores de MQTT y WebSocket no afectan la funcionalidad principal
- Se registran en los logs para debugging
- La API continúa funcionando aunque los servicios de notificación fallen
