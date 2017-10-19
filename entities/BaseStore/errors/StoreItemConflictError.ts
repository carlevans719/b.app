import { ConflictError } from '../../../common/errors/abstract'

class StoreItemConflictError extends ConflictError {
  constructor (itemName: string, storeName: string) {
    super(`Item "${itemName}" already registered in Store "${storeName}" ` +
      `with a different value`)
  }
}

export {
  StoreItemConflictError
}
