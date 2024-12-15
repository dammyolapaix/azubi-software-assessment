import { NextFunction, Request, Response } from 'express'
import cart from '.'
import asyncHandler from '../../middlewares/async'
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
        })

        if (!req.cartItem)
          return next(
            new ErrorResponse(
              `Can't find cart item with the productId of ${productId}`,
              404
            )
          )
      }

      next()
    }
  )
}
