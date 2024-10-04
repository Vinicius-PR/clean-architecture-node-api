const { StatusCodes } = require('http-status-codes')
const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')
const ServerError = require('./server-error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: new UnauthorizedError()
    }
  }

  static OkRequest (data) {
    return {
      statusCode: StatusCodes.OK,
      body: data
    }
  }
}
