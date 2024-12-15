import express from 'express'
import cartRoutes from '../features/carts/routes'
import categoryRoutes from '../features/products/categories/routes'
import productRoutes from '../features/products/routes'

const router = express.Router()

router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/carts', cartRoutes)

export default router
