class BaseError extends Error {
  constructor (message: string) {
    super(message)
    
    this.name = this.constructor.name
    this.message = message

    if (!this.stack && typeof (<any>Error).captureStackTrace === 'function') {
      (<any>Error).captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

export {
  BaseError
}
