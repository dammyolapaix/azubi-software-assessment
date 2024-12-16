import express from 'express'
import product from '.'
import { uploadImage } from '../../middlewares/uploads'
import validateRequest from '../../middlewares/validations'
import user from '../users'
import category from './categories'

const router = express.Router()

router
  .route('/')
  .get(validateRequest(product.validations.list), product.controllers.list)
  .post(
    user.middlewares.authRoute,
    user.middlewares.adminOnlyRoute,
    validateRequest(product.validations.create),
    category.middlewares.retrieve,
    product.middlewares.create,
    product.controllers.create
  )

const cpUpload = uploadImage.fields([
  { name: 'desktop', maxCount: 1 },
  { name: 'mobile', maxCount: 1 },
  { name: 'tablet', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
])

router
  .route('/:id')
  .get(
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.retrieve
  )
  .put(
    user.middlewares.authRoute,
    user.middlewares.adminOnlyRoute,
    cpUpload,
    validateRequest(product.validations.update),
    product.middlewares.retrieve,
    category.middlewares.retrieve,
    product.middlewares.update,
    product.controllers.update
  )
  .delete(
    user.middlewares.authRoute,
    user.middlewares.adminOnlyRoute,
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.delete
  )

router
  .route('/:id/restore')
  .post(
    user.middlewares.authRoute,
    user.middlewares.adminOnlyRoute,
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.restore
  )

export default router
