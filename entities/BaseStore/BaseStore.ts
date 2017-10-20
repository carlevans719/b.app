import { IteratorCallback } from '../../common/interfaces/callbacks'
import { IIndexable } from '../../common/interfaces/decorators'
import { IErrorMap } from '../../common/interfaces/errors'
import { IBaseStore, IStoreGetItemOptions, IStoreOptions } from '../../common/interfaces/store'

import { required as r } from '../../common/decorators/parameters'
import { StoreItemConflictError } from './errors/StoreItemConflictError'
import { StoreItemNotFoundError } from './errors/StoreItemNotFoundError'

/**
 * A base store class to be extended
 *
 * @class BaseStore
 * @implements {IBaseStore<T>}
 * @template T
 */
class BaseStore <T> implements IBaseStore <T> {
  // tslint:disable-next-line:variable-name
  protected __identifier: string
  // tslint:disable-next-line:variable-name
  protected __store: IIndexable<T>
  // tslint:disable-next-line:variable-name
  protected __errors: IErrorMap

  /**
   * Creates an instance of BaseStore.
   *
   * @param {string} identifier
   * @param {any} [options]
   * @memberof BaseStore
   */
  constructor (identifier: string = r('identifier'), options: IStoreOptions = {}) {
    this.__identifier = identifier
    this._registerErrors(options)

    this.__store = {}
  }

  /**
   * Get the name of this Store
   *
   * @returns {string} the store name
   * @memberof BaseStore
   */
  get name () {
    return this.__identifier
  }

  /**
   * Get the number of items in the store
   *
   * @returns {number} the item count
   * @memberof BaseStore
   */
  get length () {
    return this.keys().length
  }

  /**
   * Remove all items from the store
   *
   * @memberof BaseStore
   */
  clear () {
    for (const key of this.keys()) {
      this.remove(key)
    }
  }

  /**
   * Returns a boolean asserting whether an item with the given key is present
   * in the store or not
   *
   * @param {string} key The key to check for
   * @returns {boolean} whether the item exists
   * @memberof BaseStore
   */
  has (key: string = r('key')) {
    return key in this.__store
  }

  /**
   * Returns an array of all stored items' keys
   *
   * @returns {string[]} The item keys
   * @memberof BaseStore
   */
  keys () {
    return Object.keys(this.__store)
  }

  /**
   * Remove an item from the store with the given key
   *
   * @param {string} key
   * @param {IStoreGetItemOptions} [options={}]
   * @throws {ItemNotFoundError} if the item is not found and
   * `options.supressErrors` is not `true`
   * @returns {boolean}
   * @memberof BaseStore
   */
  remove (key: string = r('key'), options: IStoreGetItemOptions = {}) {
    if (!this.has(key) && !options.supressErrors) {
      throw new this.__errors.ItemNotFoundError(key, this.name)
    }

    return delete this.__store[key]
  }

  /**
   * Returns an array of all stored items' values
   *
   * @returns {T[]} The items
   * @memberof BaseStore
   */
  values () {
    return Object.values(this.__store)
  }

  /**
   * Calls `callback` once for each item in the store. If present, thisArg will
   * be used for the `this` value for each callback
   *
   * @param {IteratorCallback} callback
   * @param {*} [thisArg]
   * @memberof BaseStore
   */
  protected _forEach (callback: IteratorCallback<T> = r('callback'), thisArg?: any) {
    for (const key in this.__store) {
      if (this.__store.hasOwnProperty(key)) {
        callback.call(thisArg, key, this.__store[key], this.__store)
      }
    }
  }

  /**
   * Get an item from the store
   *
   * @param {string} key The item's identifier
   * @param {IStoreGetItemOptions} [options={}]
   * @throws {NotFoundError} if the item cannot be found and
   * `options.supressErrors` is not `true`
   * @returns {T}
   * @memberof BaseStore
   */
  protected _get (key: string = r('key'), options: IStoreGetItemOptions = {}) {
    if (!this.has(key) && !options.supressErrors) {
      throw new this.__errors.ItemNotFoundError(key, this.name)
    }

    return this.__store[key]
  }

  /**
   * Add an item to the Store
   *
   * @param {string} key
   * @param {T} value
   * @param {boolean} [allowOverwrite=false]
   * @throws {ConflictError} if a different item with the same key exists, and
   * `allowOverwrite` is not `true`
   * @memberof BaseStore
   */
  protected _set (key: string = r('key'), value: T = r('value'), allowOverwrite = false) {
    if (this.has(key) && value !== this.__store[key] && !allowOverwrite) {
      throw new this.__errors.ItemConflictError(key, this.name)
    }

    this.__store[key] = value
  }

  /**
   * Register the Error classes for this instance
   *
   * @param {IStoreOptions} [options]
   * @memberof BaseStore
   */
  private _registerErrors (options: IStoreOptions = {}) {
    let errors = {}

    if (typeof options === 'object' && options && options.errors && typeof options.errors === 'object') {
      errors = options.errors
    }

    this.__errors = Object.assign({
      ItemConflictError: StoreItemConflictError,
      ItemNotFoundError: StoreItemNotFoundError
    }, errors)
  }
}

export {
  BaseStore
}
