import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import categoryInstance from '.'
import asyncHandler from '../../../middlewares/async'
import { ErrorResponse } from '../../../utils/errors'
import { InsertCategory, RetrieveCategoryRequestType } from './types'

export default class CategoryMiddlewares {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCategory, {}>,
      res: Response,
      next: NextFunction
    ) => {
      req.body.slug = slugify(req.body.name, { lower: true })

      const category = await categoryInstance.services.retrieve({
        slug: req.body.slug,
      })

      if (category)
        return next(new ErrorResponse(`Category already created`, 400))

      next()
    }
  )

  retrieve = asyncHandler(
    async (
      req: RetrieveCategoryRequestType,
      res: Response,
      next: NextFunction
    ) => {
      let categoryId: string | undefined = undefined

      if (req.params.categoryId) categoryId = req.params.categoryId
      if (req.body.categoryId) categoryId = req.body.categoryId

      if (req.params.categoryId || req.body.categoryId) {
        req.category = await categoryInstance.services.retrieve({
          id: categoryId!,
        })

        if (!req.category)
          return next(
            new ErrorResponse(
              `Can't find category with the id of ${categoryId}`,
              404
            )
          )
      }

      next()
    }
  )
}
