type StatusCode = 200 | 201 | 400 | 401 | 403 | 500

export class ErrorResponse extends Error {
  message: string
  statusCode: StatusCode

  constructor(message: string, statusCode: StatusCode) {
    super(message)

    this.message = message
    this.statusCode = statusCode
  }
}
