import { BaseError } from './BaseError'

abstract class ConflictError extends BaseError {}
// tslint:disable-next-line:max-classes-per-file
abstract class NotFoundError extends BaseError {}

export {
  ConflictError,
  NotFoundError
}
