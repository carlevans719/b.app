import { ConflictError } from '../../../common/errors/abstract'

class ProviderConflictError extends ConflictError {
  constructor (provider: string) {
    super(`Provider: "${provider}" already registered`)
  }
}

export {
  ProviderConflictError
}
