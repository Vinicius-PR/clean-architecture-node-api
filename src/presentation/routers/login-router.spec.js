const { StatusCodes } = require('http-status-codes')
const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')
const InvalidParamError = require('../helpers/invalid-param-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut, authUseCaseSpy, emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}

describe('Login Router', () => {
  test('Should return 400 (BAD_REQUEST) if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 (BAD_REQUEST) if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 (UNAUTHORIZED) when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@gmail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 (OK) when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.OK)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no AuthUseCase has no auth method', async () => {
    class AuthUseCaseSpy {} // An empty class. With no method.
    const sut = new LoginRouter(AuthUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if AuthUseCase throws', async () => {
    const AuthUseCaseError = makeAuthUseCaseWithError()
    const sut = new LoginRouter(AuthUseCaseError)

    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('Should return 400 (BAD_REQUEST) if invalid Email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if no EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    class EmailValidatorSpy {}
    const sut = new LoginRouter(authUseCaseSpy, EmailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 (INTERNAL_SERVER_ERROR) if EmailValidator throws', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
