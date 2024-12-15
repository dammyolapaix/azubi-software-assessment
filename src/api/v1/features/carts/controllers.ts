import { NextFunction, Request, Response } from 'express'
import cartInstance from '.'
import asyncHandler from '../../middlewares/async'
import { INTERNAL_ERROR_MESSAGE } from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { InsertCartItem } from './types'

export default class CartControllers {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCartItem, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const [cart] = await cartInstance.services.create(req.body)

      if (!cart) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(201).json({ success: true, cart })
    }
  )
}
