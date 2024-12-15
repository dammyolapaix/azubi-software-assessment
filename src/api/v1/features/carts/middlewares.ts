import { NextFunction, Request, Response } from 'express'
import cart from '.'
import asyncHandler from '../../middlewares/async'
import { ErrorResponse } from '../../utils/errors'
import { InsertCartItem } from './types'

export default class CartMiddlewares {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCartItem, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const productInCart = await cart.services.retrieve({
        productId: req.body.productId,
      })

      if (productInCart)
        return next(new ErrorResponse(`Product already added to cart`, 400))

      next()
    }
  )
}
