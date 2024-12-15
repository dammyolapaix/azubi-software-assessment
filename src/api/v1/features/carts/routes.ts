import express from 'express'
import cart from '.'
import validateRequest from '../../middlewares/validations'
import product from '../products'

const router = express.Router()

router
  .route('/')
  .get(validateRequest(cart.validations.list), cart.controllers.list)
  .post(
    validateRequest(cart.validations.create),
    product.middlewares.retrieve,
    cart.middlewares.create,
    cart.controllers.create
  )

router
  .route('/:productId')
  .put(
    validateRequest(cart.validations.update),
    cart.middlewares.retrieve,
    cart.controllers.update
  )
  .delete(
    validateRequest(cart.validations.retrieve),
    cart.middlewares.retrieve,
    cart.controllers.delete
  )

export default router
