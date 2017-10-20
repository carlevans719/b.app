import { MissingParameterError } from '../errors/MissingParameterError'

/**
 * Throws a new MissingParameterError
 *
 * @param {string} [key] the name of the parameter which was missing
 * @throws {MissingParameterError}
 */
function required (key?: string): never {
  throw new MissingParameterError(key)
}

export {
  required
}
