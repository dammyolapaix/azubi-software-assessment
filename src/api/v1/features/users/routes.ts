import express from 'express'
import user from '.'
import validateRequest from '../../middlewares/validations'

const router = express.Router()

router
  .route('/register')
  .post(
    validateRequest(user.validations.register),
    user.middlewares.register,
    user.controllers.register
  )

router
  .route('/login')
  .post(
    validateRequest(user.validations.login),
    user.middlewares.login,
    user.controllers.login
  )

export default router
