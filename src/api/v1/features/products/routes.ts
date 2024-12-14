import express from 'express'
import product from '.'
import validateRequest from '../../middlewares/validations'
import category from './categories'

const router = express.Router()

router
  .route('/')
  .post(
    validateRequest(product.validations.create),
    category.middlewares.retrieve,
    product.middlewares.create,
    product.controllers.create
  )

export default router
