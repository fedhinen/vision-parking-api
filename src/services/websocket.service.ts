import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

export interface WebSocketMessage {
    type: string
    data: any
    timestamp: string
}

class WebSocketService {
    private io: Server | null = null

    initialize(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        })

        this.io.on('connection', (socket) => {
            console.log('Cliente WebSocket conectado:', socket.id)

            socket.on('join_room', (room: string) => {
                socket.join(room)
                console.log(`Cliente ${socket.id} se unió a la sala: ${room}`)
            })

            socket.on('leave_room', (room: string) => {
                socket.leave(room)
                console.log(`Cliente ${socket.id} salió de la sala: ${room}`)
            })

            socket.on('disconnect', () => {
                console.log('Cliente WebSocket desconectado:', socket.id)
            })
        })

        console.log('Servidor WebSocket inicializado')
    }

    broadcast(message: WebSocketMessage) {
        if (!this.io) {
            console.warn('WebSocket no inicializado')
            return
        }

        this.io.emit('message', {
            ...message,
            timestamp: new Date().toISOString()
        })
    }

    broadcastToRoom(room: string, message: WebSocketMessage) {
        if (!this.io) {
            console.warn('WebSocket no inicializado')
            return
        }

        this.io.to(room).emit('message', {
            ...message,
            timestamp: new Date().toISOString()
        })
    }

    getIO() {
        return this.io
    }
}

export const webSocketService = new WebSocketService()
