import { NextFunction, Request, Response } from 'express'
import userInstance from '.'
import asyncHandler from '../../middlewares/async'
import {
  UNAUTHENTICATED_ERROR_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
} from '../../utils/constants'
import { ErrorResponse } from '../../utils/errors'
import { InsertUser } from './types'

export default class UserMiddlewares {
  authRoute = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string | undefined

      // Check if token exists in authorization headers
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      )
        token = req.headers.authorization.split(' ')[1]

      // Make sure token exist
      if (!token || token === null || token === '' || token === 'null')
        return next(new ErrorResponse(UNAUTHENTICATED_ERROR_MESSAGE, 401))

      // Verify user by jwt
      const { id: userId } = await userInstance.utils.verifyToken(token)

      if (!userId)
        return next(new ErrorResponse(UNAUTHENTICATED_ERROR_MESSAGE, 401))

      const user = await userInstance.services.retrieve({
        id: userId,
      })

      // Checking if the user exist
      if (!user)
        return next(new ErrorResponse(UNAUTHENTICATED_ERROR_MESSAGE, 401))

      req.user = user

      next()
    }
  )

  publicRoute = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string | undefined

      // Check if token exists in authorization headers
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      )
        token = req.headers.authorization.split(' ')[1]

      // Make sure token exist
      if (token)
        return next(new ErrorResponse('You are already logged in', 403))

      next()
    }
  )

  adminOnlyRoute = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user!.role !== 'admin')
        return next(new ErrorResponse(UNAUTHORIZE_ERROR_MESSAGE, 403))

      next()
    }
  )

  customerOnlyRoute = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user!.role !== 'customer')
        return next(new ErrorResponse(UNAUTHORIZE_ERROR_MESSAGE, 403))

      next()
    }
  )

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
