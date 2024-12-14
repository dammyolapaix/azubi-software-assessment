import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import env from './env'
import { errorHandler, notFound } from './middlewares/errors'

const app = express()

const { PORT, FRONTEND_URL } = env

app.use(cors({ origin: FRONTEND_URL }))
// Middleware to parse JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`App started on port ${PORT}`)
})
