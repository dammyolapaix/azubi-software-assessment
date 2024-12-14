import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import productInstance from '.'
import asyncHandler from '../../middlewares/async'
import { ErrorResponse } from '../../utils/errors'
import { InsertProduct } from './types'

export default class ProductMiddlewares {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertProduct, {}>,
      res: Response,
      next: NextFunction
    ) => {
      req.body.slug = slugify(req.body.name, { lower: true })

      const product = await productInstance.services.retrieve({
        slug: req.body.slug,
      })

      if (product)
        return next(new ErrorResponse(`Product already created`, 400))

      next()
    }
  )
}
