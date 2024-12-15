import { NextFunction, Request, Response } from 'express'
import cart from '.'
import asyncHandler from '../../middlewares/async'
import { UNAUTHORIZE_ERROR_MESSAGE } from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { InsertCartItem, RetrieveCartItemRequestType } from './types'

export default class CartMiddlewares {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCartItem, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const productInCart = await cart.services.retrieve({
        productId: req.body.productId,
        userId: req.user!.id,
      })

      if (productInCart)
        return next(new ErrorResponse(`Product already added to cart`, 400))

      next()
    }
  )

  retrieve = asyncHandler(
    async (
      req: RetrieveCartItemRequestType,
      res: Response,
      next: NextFunction
    ) => {
      let productId: string | undefined = undefined

      if (req.params.productId) productId = req.params.productId
      if (req.body.productId) productId = req.body.productId

      if (req.params.productId || req.body.productId) {
        req.cartItem = await cart.services.retrieve({
          productId: productId!,
          userId: req.user!.id,
        })

        if (!req.cartItem)
          return next(new ErrorResponse(UNAUTHORIZE_ERROR_MESSAGE, 403))
      }

      next()
    }
  )
}
