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
    product.controllers.retrieve
  )

export default router
