import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import categoryInstance from '.'
import asyncHandler from '../../../middlewares/async'
import { ErrorResponse } from '../../../utils/errors'
import { InsertCategory } from './types'

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
}
