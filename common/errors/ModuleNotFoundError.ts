import { NotFoundError } from './abstract'

class ModuleNotFoundError extends NotFoundError {
  constructor (moduleName?: string) {
    super(`Module ${moduleName ? '"' + moduleName + '" ' : ''}not found`)
  }
}

export {
  ModuleNotFoundError
}
