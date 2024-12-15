import express from 'express'
import cart from '.'
import validateRequest from '../../middlewares/validations'
import product from '../products'

const router = express.Router()

router
  .route('/')
  .post(
    validateRequest(cart.validations.create),
    product.middlewares.retrieve,
    cart.middlewares.create,
    cart.controllers.create
  )

export default router
