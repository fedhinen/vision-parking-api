import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

export interface WebSocketMessage {
    event: string
    data: any
    timestamp?: string
}

export interface BroadcastOptions {
    event: string
    data: any
    room?: string
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

    broadcast(options: BroadcastOptions) {
        if (!this.io) {
            console.warn('WebSocket no inicializado')
            return
        }

        const message: WebSocketMessage = {
            event: options.event,
            data: options.data,
            timestamp: new Date().toISOString()
        }

        if (options.room) {
            // Broadcast a una sala específica
            this.io.to(options.room).emit(options.event, message)
        } else {
            // Broadcast global
            this.io.emit(options.event, message)
        }
    }

    getIO() {
        return this.io
    }
}

export const webSocketService = new WebSocketService()
