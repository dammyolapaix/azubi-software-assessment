import { NextFunction, Request, Response } from 'express'
import productInstance from '.'
import asyncHandler from '../../middlewares/async'
import { INTERNAL_ERROR_MESSAGE } from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { InsertProduct, ListPolicy } from './types'

export default class ProductControllers {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertProduct, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const [product] = await productInstance.services.create(req.body)

      if (!product) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(201).json({ success: true, product })
    }
  )

  list = asyncHandler(
    async (
      req: Request<{}, {}, {}, ListPolicy>,
      res: Response,
      next: NextFunction
    ) => {
      const products = await productInstance.services.list(req.query)

      if (!products) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 400))

      res.status(200).json({ success: true, products })
    }
  )

  retrieve = asyncHandler(
    async (
      req: Request<{ id: string }, {}, {}, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const product = await productInstance.services.retrieve(req.params)

      if (!product)
        return next(
          new ErrorResponse(
            `Can't find product with the id of ${req.params.id}`,
            404
          )
        )

      res.status(200).json({ success: true, product })
    }
  )
}
