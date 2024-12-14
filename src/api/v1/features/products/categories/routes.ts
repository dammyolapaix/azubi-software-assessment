import express from 'express'
import category from '.'
import validateRequest from '../../../middlewares/validations'

const router = express.Router()

router
  .route('/')
  .post(
    validateRequest(category.validations.create),
    category.controllers.create
  )

export default router
