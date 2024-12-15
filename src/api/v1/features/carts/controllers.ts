import { NextFunction, Request, Response } from 'express'
import cartInstance from '.'
import asyncHandler from '../../middlewares/async'
import { INTERNAL_ERROR_MESSAGE } from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { CartItem, InsertCartItem } from './types'

export default class CartControllers {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCartItem, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const [cart] = await cartInstance.services.create({
        ...req.body,
        userId: req.user!.id,
      })

      if (!cart) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(201).json({ success: true, cart })
    }
  )

  list = asyncHandler(
    async (
      req: Request<{}, {}, {}, Partial<CartItem>>,
      res: Response,
      next: NextFunction
    ) => {
      const carts = await cartInstance.services.list({
        ...req.query,
        userId: req.user!.id,
      })

      if (!carts) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(200).json({ success: true, carts })
    }
  )

  update = asyncHandler(
    async (
      req: Request<{ productId: string }, {}, Pick<CartItem, 'quantity'>, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const cart = await cartInstance.services.update(
        req.params.productId,
        req.user!.id,
        req.body
      )

      if (!cart) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(200).json({ success: true, cart })
    }
  )

  delete = asyncHandler(
    async (
      req: Request<{ productId: string }, {}, {}, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const cart = await cartInstance.services.delete(
        req.params.productId,
        req.user!.id
      )

      if (!cart) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(200).json({ success: true, cart })
    }
  )
}
