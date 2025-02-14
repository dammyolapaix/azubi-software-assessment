import express from 'express'
import cartRoutes from '../features/carts/routes'
import categoryRoutes from '../features/products/categories/routes'
import productRoutes from '../features/products/routes'
import user from '../features/users'
import userRoutes from '../features/users/routes'

const router = express.Router()

router.use(
  '/categories',
  user.middlewares.authRoute,
  user.middlewares.adminOnlyRoute,
  categoryRoutes
)

router.use('/products', productRoutes)

router.use(
  '/carts',
  user.middlewares.authRoute,
  user.middlewares.customerOnlyRoute,
  cartRoutes
)

router.use('/users', userRoutes)

export default router
