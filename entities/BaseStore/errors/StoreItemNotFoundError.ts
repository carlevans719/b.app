import { NotFoundError } from '../../../common/errors/abstract'

class StoreItemNotFoundError extends NotFoundError {
  constructor (itemName: string, storeName: string) {
    super(`Item "${itemName}" not found in Store "${storeName}"`)
  }
}

export {
  StoreItemNotFoundError
}
