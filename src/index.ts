import express from 'express'
import { router } from './routes/routes'
import { errorHandler } from '../src/middleware/error/handle-error'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use("/api", router)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})