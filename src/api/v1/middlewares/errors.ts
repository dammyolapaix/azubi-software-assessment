import { NextFunction, Request, Response } from 'express'
import { StatusCode } from '../types'
import { INTERNAL_ERROR_MESSAGE } from '../utils/constants'
import { ErrorResponse } from '../utils/errors'

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: StatusCode =
    res.statusCode === 200 ? 500 : (res.statusCode as StatusCode)
  let message = err.message ? err.message : INTERNAL_ERROR_MESSAGE

  // @ts-ignore
  if (err.code === '22P02' && err.routine === 'string_to_uuid') {
    statusCode = 400
    message = 'Resource not found'
    new ErrorResponse(message, statusCode)
  }

  res.status(err.statusCode || statusCode).json({
    success: false,
    errors: [
      {
        err: err.name,
        message,
        stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
      },
    ],
  })
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}
