import { NotFoundError } from '../../../common/errors/abstract'

class ProviderNotFoundError extends NotFoundError {
  constructor (provider: string) {
    super(`Provider: "${provider}" not found`)
  }
}

export {
  ProviderNotFoundError
}
