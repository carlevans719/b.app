import { IApplication } from './application'
import { IteratorCallback } from './callbacks'
import { IIndexable } from './decorators'
import { IErrorMap } from './errors'

interface IBaseStore <T> {
  // (protected) __identifier : string
  // (protected) __store : IIndexable<T>
  // (protected) __errors : IErrorMap
  name : string
  length : number
  clear () : void
  has (key: string) : boolean
  keys () : string[]
  remove (key: string, options?: IStoreGetItemOptions) : void
  values () : T[]
  // (protected) _forEach (callback: IteratorCallback<U>, thisArg?: any) : void
  // (protected) _get (key: string, options?: IStoreGetItemOptions) : T
  // (protected) _set (key: string, reference: T, allowOverwrite?: boolean) : void
  // (protected) _registerErrors (options: IStoreOptions) : void
}

interface IStoreOptions {
  errors?: IErrorMap
}

interface IStoreGetItemOptions {
  supressErrors?: boolean
}

interface IStore <T> extends IBaseStore <T> {
  forEach (callback: IteratorCallback<T>, thisArg?: any): void
  get (name: string, options?: IStoreGetItemOptions): T
  set (key: string, value: T, allowOverride?: boolean): void
}

export {
  IBaseStore,
  IStoreGetItemOptions,
  IStoreOptions,
  IStore
}
