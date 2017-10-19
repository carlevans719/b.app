import { NotFoundError } from './abstract'

class MissingParameterError extends NotFoundError {
  constructor (parameterName?: string) {
    super(`Required parameter ${parameterName ? '"' + parameterName + '" ' : ''}missing`)
  }
}

export {
  MissingParameterError
}
