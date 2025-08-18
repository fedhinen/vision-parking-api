import mqtt, { MqttClient } from 'mqtt'
import { parkingSpotService } from './parking-spot.service'

export interface ReservationMqttMessage {
    rsv_id: string
    usr_id: string
    pks_id: string
    status: string
    esp32_id: string
    tagIdentifier: string
}

export interface ReservationStatusMqttMessage {
    rsv_id: string
    pks_id: string
    status: string
    action: 'accepted' | 'rejected'
}

class MQTTService {
    private client: MqttClient | null = null
    private isConnected = false
    private isConnecting = false

    constructor() {
        this.connect()
    }

    private connect() {
        if (this.isConnected || this.isConnecting) {
            return
        }
        this.isConnecting = true

        try {
            this.client = mqtt.connect(process.env.MQTT_BROKER_URL ?? "mqtt://localhost", {
                port: Number(process.env.MQTT_BROKER_PORT) ?? 1883,
                reconnectPeriod: 1000,
                connectTimeout: 5 * 60 * 1000,
                clean: true
            })

            this.client.on('connect', () => {
                console.log('Conectado al broker MQTT')
                this.isConnected = true
                this.isConnecting = false
            })

            this.client.on('error', (err) => {
                console.error('Error de conexión MQTT:', err)
                this.isConnected = false
                this.isConnecting = false
            })

            this.client.on('close', () => {
                console.log('Conexión MQTT cerrada')
                this.isConnected = false
                this.isConnecting = false
            })

            this.client.on('disconnect', () => {
                console.log('Desconectado del broker MQTT')
                this.isConnected = false
                this.isConnecting = false
            })
        } catch (error) {
            console.error('Error al inicializar cliente MQTT:', error)
        }
    }

    async publishReservationCreated(message: ReservationMqttMessage): Promise<void> {
        const topic = 'api:reservation_created:broker'
        return this.publish(topic, message)
    }

    async publishReservationStatusChanged(message: ReservationStatusMqttMessage): Promise<void> {
        const topic = 'api:reservation_status_changed:broker'
        return this.publish(topic, message)
    }

    async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client || !this.isConnected) {
                console.warn('Cliente MQTT no conectado, reintentando conexión...')
                this.connect()
                setTimeout(() => {
                    if (!this.client || !this.isConnected) {
                        reject(new Error('No se pudo establecer conexión MQTT para suscripción'))
                        return
                    }
                    this.subscribeToTopic(topic, callback, resolve, reject)
                }, 1000)
                return
            }

            this.subscribeToTopic(topic, callback, resolve, reject)
        })
    }

    private subscribeToTopic(
        topic: string,
        callback: (message: any) => void,
        resolve: () => void,
        reject: (error: Error) => void
    ) {
        this.client!.subscribe(topic, { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al suscribirse al tópico ${topic}:`, err)
                reject(err)
            } else {
                console.log(`Suscrito al tópico ${topic}`)
                
                // Configurar el listener para mensajes de este tópico
                this.client!.on('message', (receivedTopic, message) => {
                    if (receivedTopic === topic) {
                        try {
                            const parsedMessage = JSON.parse(message.toString())
                            console.log(`Mensaje recibido en tópico ${topic}:`, parsedMessage)
                            callback(parsedMessage)
                        } catch (parseError) {
                            console.error(`Error al parsear mensaje del tópico ${topic}:`, parseError)
                        }
                    }
                })
                
                resolve()
            }
        })
    }

    async publish(topic: string, message: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client || !this.isConnected) {
                console.warn('Cliente MQTT no conectado, reintentando conexión...')
                this.connect()
                setTimeout(() => {
                    if (!this.client || !this.isConnected) {
                        reject(new Error('No se pudo establecer conexión MQTT'))
                        return
                    }
                    this.publishMessage(topic, message, resolve, reject)
                }, 1000)
                return
            }

            this.publishMessage(topic, message, resolve, reject)
        })
    }

    private publishMessage(
        topic: string,
        message: any,
        resolve: () => void,
        reject: (error: Error) => void
    ) {
        this.client!.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al publicar en tópico ${topic}:`, err)
                reject(err)
            } else {
                console.log(`Mensaje publicado en tópico ${topic}:`, message)
                resolve()
            }
        })
    }

    disconnect() {
        if (this.client) {
            this.client.end()
            this.isConnected = false
        }
    }
}

export const mqttService = new MQTTService()

export async function initializeMqttSubscriptions() {
    try {
        await mqttService.subscribe('sensor:status_spot:api', async (message: {esp32Id: string}) => {
            console.log('Estado del sensor recibido:', message)

            const data = await parkingSpotService.getParkingSpotConfig(message.esp32Id)

            await mqttService.publish(`api:status_spot:sensor`, {
                ...data,
                esp32Id: message.esp32Id
            })
        })

        console.log('Suscripciones MQTT inicializadas exitosamente')
    } catch (error) {
        console.error('Error al inicializar suscripciones MQTT:', error)
    }
}