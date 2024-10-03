const { StatusCodes } = require('http-status-codes')
const MissingParamError = require('./missing-param-error')

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
}
