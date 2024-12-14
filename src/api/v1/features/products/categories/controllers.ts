import { NextFunction, Request, Response } from 'express'
import categoryInstance from '.'
import asyncHandler from '../../../middlewares/async'
import { INTERNAL_ERROR_MESSAGE } from '../../../utils/constants'
import { ErrorResponse } from '../../../utils/errors'
import { InsertCategory } from './types'

export default class CategoryControllers {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertCategory, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const [category] = await categoryInstance.services.create(req.body)

      if (!category) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      res.status(201).json({ success: true, category })
    }
  )
}
