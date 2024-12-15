import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import productInstance from '.'
import asyncHandler from '../../middlewares/async'
import { ErrorResponse } from '../../utils/errors'
import { InsertProduct, RetrieveProductRequestType } from './types'

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

  retrieve = asyncHandler(
    async (
      req: RetrieveProductRequestType,
      res: Response,
      next: NextFunction
    ) => {
      let productId: string | undefined = undefined

      if (req.params.id) productId = req.params.id
      if (req.body.productId) productId = req.body.productId

      if (req.params.id || req.body.productId) {
        req.product = await productInstance.services.retrieve({
          id: productId!,
          isDeleted: req.path === `/${productId}/restore` ? true : undefined,
        })

        if (!req.product)
          return next(
            new ErrorResponse(
              `Can't find product with the id of ${productId}`,
              404
            )
          )
      }

      next()
    }
  )

  update = asyncHandler(
    async (
      req: Request<{ id: string }, {}, InsertProduct, {}>,
      res: Response,
      next: NextFunction
    ) => {
      if (req.body.name) {
        req.body.slug = slugify(req.body.name, { lower: true })

        const product = await productInstance.services.retrieve({
          slug: req.body.slug,
        })

        if (product)
          return next(
            new ErrorResponse(
              `Product already existed, please try different name`,
              400
            )
          )
      }

      next()
    }
  )
}
