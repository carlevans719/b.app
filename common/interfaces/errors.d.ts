interface IBaseErrorStatic {
  new (...args: any[]): IBaseError
}

interface IBaseError extends Error {}

interface IErrorMap {
  [key: string]: IBaseErrorStatic
}

export {
  IBaseErrorStatic,
  IBaseError,
  IErrorMap
}
