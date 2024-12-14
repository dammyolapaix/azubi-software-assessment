import { StatusCode } from '../types'

export class ErrorResponse extends Error {
  message: string
  statusCode: StatusCode

  constructor(message: string, statusCode: StatusCode) {
    super(message)

    this.message = message
    this.statusCode = statusCode
  }
}
