import { BaseError } from './BaseError'

abstract class ConflictError extends BaseError {}
abstract class NotFoundError extends BaseError {}

export {
  ConflictError,
  NotFoundError
}
