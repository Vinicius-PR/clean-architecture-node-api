const { StatusCodes } = require('http-status-codes')

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email) {
      return {
        statusCode: StatusCodes.BAD_REQUEST
      }
    }
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
  })
})
