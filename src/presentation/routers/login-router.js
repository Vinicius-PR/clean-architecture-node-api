const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.internalServerError()
    }
    const { email, password } = httpRequest.body
    // if (email === 'invalid_email@gmail.com' && password === 'invalid_password') {
    //   return HttpResponse.unauthorizedError()
    // }
    // if (email === 'valid_email@gmail.com' && password === 'valid_password') {
    //   return HttpResponse.OkRequest()
    // }
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    const accessToken = this.authUseCase.auth(email, password)

    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }
    return HttpResponse.OkRequest()
  }
}
