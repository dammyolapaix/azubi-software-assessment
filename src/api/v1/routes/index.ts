import express from 'express'
import categoryRoutes from '../features/products/categories/routes'
import productRoutes from '../features/products/routes'

const router = express.Router()

router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)

export default router
