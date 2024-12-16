import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import limiter from './config/rate-limit'
import env from './env'
import { errorHandler, notFound } from './middlewares/errors'
import routes from './routes'
dotenv.config()

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
// Middleware to parse JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    info: {
      doc: 'https://www.postman.com/interstellar-meadow-654430/workspace/azubi-assessment-api-for-product-list-and-shopping-cart',
    },
  })
})

app.use(notFound)
app.use(errorHandler)

export default app
