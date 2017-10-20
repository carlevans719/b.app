import { IIndexable } from './decorators'

type IteratorCallback<T> = (key: string, value: T, iterable: IIndexable<T>) => any

export {
  IteratorCallback
}
