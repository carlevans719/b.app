import { IApplication } from './application'
import { IteratorCallback } from './callbacks'
import { IIndexable } from './decorators'
import { IErrorMap } from './errors'

interface IStoreStatic {
  new <T> (name: string, options: IStoreOptions): IStore <T>
}

interface IStoreOptions {
  errors?: IErrorMap
}

interface IStoreGetItemOptions {
  supressErrors?: boolean
}

interface IStore <T> {
  // (protected) __identifier: string
  // (protected) __store: IIndexable<T>
  // (protected) __errors: IErrorMap
  name: string
  length: number
  get (key: string, options: IStoreGetItemOptions) : T
  set (key: string, reference: T, allowOverwrite?: boolean) : void
  remove (key: string, options?: IStoreGetItemOptions) : void
  clear () : void
  keys () : string[]
  values () : T[]
  has (key: string) : boolean
  forEach (callback: IteratorCallback<T>, thisArg?: any) : void
  // (protected) _ensureNoConflict (key: string, reference: T) : void
  // (protected) _registerErrors (options: IStoreOptions) : void
}

export {
  IStoreStatic,
  IStoreGetItemOptions,
  IStoreOptions,
  IStore
}
