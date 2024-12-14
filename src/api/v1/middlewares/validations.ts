import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { convertQueryStringToObject } from '../utils/query-string-to-object'

const validateRequest =
  (schema: z.AnyZodObject) =>
  async (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    req.query = convertQueryStringToObject(req.query)

    try {
      const validatedRequest = schema.parse({
        params: req.params,
        body: req.body,
        query: req.query,
      })

      // Set the validated request as the request for the next middleware
      req.params =
        validatedRequest.params === undefined
          ? req.params
          : validatedRequest.params

      req.body =
        validatedRequest.body === undefined ? req.body : validatedRequest.body

      req.query =
        validatedRequest.query === undefined
          ? req.query
          : validatedRequest.query

      next()
    } catch (error) {
      let errors: {}[] = []

      if (error instanceof z.ZodError) {
        errors = error.errors.map((err) => {
          return {
            message: err.message,
          }
        })
      }

      res.status(400).json({
        success: false,
        errors,
      })
    }
  }

export default validateRequest
