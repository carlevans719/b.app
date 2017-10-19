import { MissingParameterError } from '../errors/MissingParameterError'

/**
 * Throws a new MissingParameterError
 *
 * @param {string} [key] the name of the parameter which was missing 
 * @throws {MissingParameterError}
 */
function required (key?: string): any {
  throw new MissingParameterError(key)
}

export {
  required
}
