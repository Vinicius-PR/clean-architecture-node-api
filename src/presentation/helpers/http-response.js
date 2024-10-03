const { StatusCodes } = require('http-status-codes')
const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
  }

  static unauthorizedError () {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: new UnauthorizedError()
    }
  }
}
