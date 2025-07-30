import express from 'express'
import { router } from './routes/routes'
import { errorHandler } from './middleware/error/handle-error'
import cors from "cors"
import morgan from "morgan"

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
app.use(morgan("combined"))
app.use((req, res, next) => {
    console.log('Petición entrante: body',req.body)
    console.log('Petición entrante: params',req.params)

    next()
})
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' })
})
app.use("/api", router)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

declare global {
    namespace Express {
        interface Request {
            user?: {
                usr_id: string;
                usr_email: string;
                usr_name: string;
            };
        }
    }
}