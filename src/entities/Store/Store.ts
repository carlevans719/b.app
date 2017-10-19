import { IApplication } from '../../common/interfaces/application'
import { IStoreStatic, IStore, IStoreOptions, IStoreGetItemOptions } from '../../common/interfaces/store'
import { IteratorCallback } from '../../common/interfaces/callbacks'
import { IIndexable } from '../../common/interfaces/decorators'
import { IErrorMap } from '../../common/interfaces/errors'

import { StoreItemNotFoundError } from './errors/StoreItemNotFoundError'
import { StoreItemConflictError } from './errors/StoreItemConflictError'
import { required as r } from '../../common/decorators/parameters'

/**
 * A data store for holding items
 *
 * @class Store
 */
const Store: IStoreStatic = class Store <T = any> implements IStore <T> {
  protected __identifier: string
  protected __store: IIndexable<T>
  protected __errors: IErrorMap

  /**
   * Creates an instance of Store.
   *
   * @param {any} application 
   * @param {string} identifier 
   * @param {any} [options] 
   * @memberof Store
   */
  constructor (identifier = r('identifier'), options: IStoreOptions = {}) {
    this.__identifier = identifier
    this._registerErrors(options)

    this.__store = {}
  }

  /**
   * Get the name of this Store
   *
   * @returns {string} the store name
   * @memberof Store
   */
  get name () {
    return this.__identifier
  }

  /**
   * Get the number of items in the store
   *
   * @returns {number} the item count
   * @memberof Store
   */
  get length () {
    return this.keys().length
  }

  /**
   * Get an item from the store
   *
   * @param {string} key The item's identifier
   * @param {IStoreGetItemOptions} [options={}]
   * @throws {NotFoundError} if the item cannot be found and
   * `options.supressErrors` is not `true`
   * @returns {T}
   * @memberof Store
   */
  get (key = r('key'), options: IStoreGetItemOptions) {
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
   * @memberof Store
   */
  set (key = r('key'), value = r('value'), allowOverwrite = false) {
    if (!allowOverwrite) {
      this._ensureNoConflict(key, value)
    }

    this.__store[key] = value
  }

  /**
   * Remove an item from the store with the given key
   *
   * @param {string} key
   * @param {IStoreGetItemOptions} [options={}]
   * @throws {ItemNotFoundError} if the item is not found and
   * `options.supressErrors` is not `true`
   * @returns {boolean}
   * @memberof Store
   */
  remove (key = r('key'), options: IStoreGetItemOptions = {}) {
    if (!this.has(key) && !options.supressErrors) {
      throw new this.__errors.ItemNotFoundError(key, this.name)
    }

    return delete this.__store[key]
  }

  /**
   * Remove all items from the store
   *
   * @memberof Store
   */
  clear () {
    for (let key of this.keys()) {
      this.remove(key)
    }
  }

  /**
   * Returns an array of all stored items' keys
   *
   * @returns {string[]} The item keys
   * @memberof Store
   */
  keys () {
    return Object.keys(this.__store)
  }

  /**
   * Returns an array of all stored items' values
   *
   * @returns {T[]} The items
   * @memberof Store
   */
  values () {
    return Object.values(this.__store)
  }

  /**
   * Returns a boolean asserting whether an item with the given key is present
   * in the store or not
   *
   * @param {string} key The key to check for
   * @returns {boolean} whether the item exists
   * @memberof Store
   */
  has (key: string) {
    return key in this.__store
  }

  /**
   * Calls `callback` once for each item in the store. If present, thisArg will
   * be used for the `this` value for each callback
   *
   * @param {IteratorCallback} callback 
   * @param {*} [thisArg]
   * @memberof Store
   */
  forEach (callback: IteratorCallback<T>, thisArg?: any) {
    for (let key in this.__store) {
      callback.call(thisArg, key, this.__store[key], this.__store)
    }
  }

  /**
   * Ensure that an item has not already been registered. Throws a
   * StoreItemConflict Error if it has and the reference does not point to the
   * same item.
   *
   * @param {string} key The key of the new item
   * @param {T} reference 
   * @returns {boolean|StoreItemConflict}
   * @memberof Store
   */
  protected _ensureNoConflict (key = r('key'), reference: T = r('reference')) {
    if (!this.has(key)) {
      return true
    }

    if (reference === this.__store[key]) {
      return true
    }

    throw new this.__errors.ItemConflictError(key, this.name)
  }

  /**
   * Register the Error classes for this instance
   *
   * @param {IStoreGetItemOptions} [options] 
   * @memberof Store
   */
  protected _registerErrors (options: IStoreOptions = {}) {
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
  Store
}
