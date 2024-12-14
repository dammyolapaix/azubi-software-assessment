import express from 'express'
import categoryRoutes from '../features/products/categories/routes'

const router = express.Router()

router.use('/categories', categoryRoutes)

export default router
