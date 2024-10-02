const { StatusCodes } = require('http-status-codes')

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.internalServerError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
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

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login Router', () => {
  test('Should return 400 (BAD_REQUEST) if no email is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 (BAD_REQUEST) if no password is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no httpRequest is provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if httpRequest have no body', () => {
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })
})
