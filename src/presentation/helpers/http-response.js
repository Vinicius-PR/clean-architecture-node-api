const { StatusCodes } = require('http-status-codes')
const UnauthorizedError = require('./unauthorized-error')
const ServerError = require('./server-error')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: error
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
