import { NextFunction, Request, Response } from 'express'
import userInstance from '.'
import asyncHandler from '../../middlewares/async'
import { ErrorResponse } from '../../utils/errors'
import { InsertUser } from './types'

export default class UserMiddlewares {
  register = asyncHandler(
    async (
      req: Request<{}, {}, InsertUser, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body

      // Check if user exists
      const user = await userInstance.services.retrieve({ email })

      if (user)
        return next(
          new ErrorResponse('You already have an account, please login', 400)
        )

      req.body.password = await userInstance.utils.hashPassword(password!)

      next()
    }
  )

  login = asyncHandler(
    async (
      req: Request<{}, {}, InsertUser, {}>,
      res: Response,
      next: NextFunction
    ) => {
      let { email, password } = req.body

      // Check if user exists
      const user = await userInstance.services.retrieve({
        email,
        password: true,
      })

      if (!user) return next(new ErrorResponse('Invalid credentials', 400))

      if (!user.password)
        return next(new ErrorResponse('Invalid credentials', 400))

      // Check if password is correct, by comparing the entered password and the user password
      const passwordMatched = await userInstance.utils.comparePasswords(
        password!,
        user.password
      )

      if (!passwordMatched)
        return next(new ErrorResponse('Invalid credentials', 400))

      // Excluding the password
      const { password: userPassword, ...restUser } = user

      req.user = restUser

      next()
    }
  )
}
