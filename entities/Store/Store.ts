import { IteratorCallback } from '../../common/interfaces/callbacks'
import { IBaseStore, IStore, IStoreGetItemOptions, IStoreOptions } from '../../common/interfaces/store'

import { required as r } from '../../common/decorators/parameters'
import { BaseStore } from '../BaseStore/BaseStore'

/**
 * A data store for holding items
 *
 * @class Store
 */
class Store <T> extends BaseStore <T> implements IStore <T> {
  /**
   * Calls `callback` once for each item in the store. If present, thisArg will
   * be used for the `this` value for each callback
   *
   * @param {IteratorCallback} callback
   * @param {*} [thisArg]
   * @memberof Store
   */
  forEach (callback: IteratorCallback<T> = r('callback'), thisArg?: any) {
    return super._forEach(callback, thisArg)
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
  get (key: string = r('key'), options: IStoreGetItemOptions = {}) {
    return super._get(key, options)
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
  set (key: string = r('key'), value: T = r('value'), allowOverwrite: boolean = false) {
    return super._set(key, value, allowOverwrite)
  }
}

export {
  Store
}
