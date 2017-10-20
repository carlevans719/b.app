import { BaseError } from './BaseError'

class InvalidParameterError extends BaseError {
  constructor (parameterName: string, reason?: string) {
    let str = `Invalid parameter ${parameterName}`
    if (reason) {
      str += `: ${reason}`
    }

    super(str)
  }
}

export {
  InvalidParameterError
}
