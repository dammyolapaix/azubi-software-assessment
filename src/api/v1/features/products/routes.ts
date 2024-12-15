import express from 'express'
import product from '.'
import validateRequest from '../../middlewares/validations'
import category from './categories'

const router = express.Router()

router
  .route('/')
  .get(validateRequest(product.validations.list), product.controllers.list)
  .post(
    validateRequest(product.validations.create),
    category.middlewares.retrieve,
    product.middlewares.create,
    product.controllers.create
  )

router
  .route('/:id')
  .get(
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.retrieve
  )
  .put(
    validateRequest(product.validations.update),
    product.middlewares.retrieve,
    category.middlewares.retrieve,
    product.middlewares.update,
    product.controllers.update
  )
  .delete(
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.delete
  )

router
  .route('/:id/restore')
  .post(
    validateRequest(product.validations.retrieve),
    product.middlewares.retrieve,
    product.controllers.restore
  )

export default router
