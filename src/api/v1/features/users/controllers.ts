import { NextFunction, Request, Response } from 'express'
import userInstance from '.'
import asyncHandler from '../../middlewares/async'
import { INTERNAL_ERROR_MESSAGE } from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { InsertUser } from './types'

export default class UserControllers {
  register = asyncHandler(
    async (
      req: Request<{}, {}, InsertUser, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const [user] = await userInstance.services.register(req.body)

      if (!user) return next(new ErrorResponse(INTERNAL_ERROR_MESSAGE, 500))

      const token = await userInstance.utils.signToken({ id: user.id })

      res.status(201).json({ success: true, token })
    }
  )

  login = asyncHandler(
    async (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
      const token = await userInstance.utils.signToken({ id: req.user!.id })

      res.status(200).json({ success: true, token })
    }
  )
}
