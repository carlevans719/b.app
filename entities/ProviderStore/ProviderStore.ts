import { IApplication } from '../../common/interfaces/application'
import {
  IProvider,
  IProviderEntry,
  IProviderStatic,
  IProviderStore,
  IProviderStoreOptions,
  IRegisterOptions
} from '../../common/interfaces/provider'
import { IStore, IStoreOptions } from '../../common/interfaces/store'

import { required as r } from '../../common/decorators/parameters'
import { BaseStore } from '../BaseStore/BaseStore'
import { Store } from '../Store/Store'
import { ProviderConflictError } from './errors/ProviderConflictError'
import { ProviderNotFoundError } from './errors/ProviderNotFoundError'

/**
 * A datastore for Providers
 *
 * @class ProviderStore
 * @extends {BaseStore}
 */
class ProviderStore extends BaseStore <IStore<IProviderEntry>> implements IProviderStore {
  static storeOptions: IStoreOptions = {
    errors: {
      ItemConflictError: ProviderConflictError,
      ItemNotFoundError: ProviderNotFoundError
    }
  }

  // tslint:disable-next-line:variable-name
  private __application: IApplication
  // tslint:disable-next-line:variable-name
  private __defaultGroupName: string = 'default'

  /**
   * Creates an instance of ProviderStore.
   *
   * @param {IApplication} application
   * @memberof ProviderStore
   */
  constructor (application: IApplication = r('application'), options: IProviderStoreOptions = {}) {
    super('providers', ProviderStore.storeOptions)

    this.__application = application

    if (typeof options.defaultGroupName !== 'undefined') {
      this.__defaultGroupName = options.defaultGroupName
    }

    this._getOrCreateGroupStore(this.__defaultGroupName)
  }

  /**
   * Get the number of items stored across all groups
   *
   * @returns {number}
   * @memberof ProviderStore
   */
  get length () {
    let count = 0
    super._forEach((groupName, groupStore) => count += groupStore.length)

    return count
  }

  /**
   * Get the default group name
   *
   * @readonly
   * @returns {string}
   * @memberof ProviderStore
   */
  get defaultGroupName () {
    return this.__defaultGroupName
  }

  /**
   * Register a new Provider
   *
   * @param {string} name The name of the Provider
   * @param {IProviderStatic} ProviderCtor A reference to the Provider
   * @param {IRegisterOptions} [options] Optional, additional options
   * @memberof ProviderStore
   */
  register (name: string = r('name'), Provider: IProviderStatic = r('Provider'), options: IRegisterOptions = {}) {
    const groupStore = this._getOrCreateGroupStore(options.groupName || this.__defaultGroupName)

    const providerEntry: IProviderEntry = {
      initialised: Boolean(options.initialise),
      Ctor: Provider,
      config: options.config || {}
    }
    if (options.initialise) {
      providerEntry.instance = new Provider(this.__application, providerEntry.config)
    }

    return groupStore.set(name, providerEntry)
  }

  /**
   * Get a Provider out of a group store
   *
   * @param {string} name The provider name
   * @param {string} [groupName=this.__defaultGroupName] The group name
   * @memberof ProviderStore
   */
  get (name: string = r('name'), groupName: string = this.__defaultGroupName) {
    const groupStore = super._get(groupName)
    const providerEntry = groupStore.get(name)

    if (!providerEntry.initialised) {
      providerEntry.instance = new providerEntry.Ctor(this.__application, providerEntry.config)
      groupStore.set(name, providerEntry, true)
    }

    return providerEntry.instance as IProvider
  }

  /**
   * Get a new instance of a provider
   *
   * @param {string} name The provider name
   * @param {string} [groupName=this.__defaultGroupName] The group name
   * @param {any} [config] The config to use during instantiation. Defaults to
   * the one passed during registration
   */
  getNew (name: string = r('name'), groupName: string = this.__defaultGroupName, config?: any) {
    const groupStore = super._get(groupName)
    const providerEntry = groupStore.get(name)

    if (!providerEntry.initialised) {
      providerEntry.instance = new providerEntry.Ctor(this.__application, providerEntry.config)
      groupStore.set(name, providerEntry, true)
    }

    return new providerEntry.Ctor(this.__application, config || providerEntry.config)
  }

  /**
   * Search for a group store with the given name and return its first
   * item. If a group store isn't found with the given name, search all
   * group stores for a Provider with a matching name
   *
   * @param {string} name The group store or Provider name
   * @returns {IProvider}
   */
  find (name: string = r('name')): IProvider {
    // Look for a matching group store first, return it's first item if found
    if (super.has(name) && super._get(name).length) {
      const store = super._get(name)
      return this.get(store.keys()[0], name)
    }

    // Fall back to looking for a matching provider in any group store
    let found: IProvider|undefined

    super._forEach((groupName, groupStore) => {
      if (!found && groupStore.has(name)) {
        found = this.get(name, groupName)
      }
    })

    if (typeof found === 'undefined') {
      throw new this.__errors.ItemNotFoundError(name)
    }

    return found
  }

  /**
   * Get a group store, creating it if it doesn't already exist
   *
   * @private
   * @param {string} name
   * @returns {IStore<IProviderEntry>}
   * @memberof ProviderStore
   */
  private _getOrCreateGroupStore (name: string = r('name')) {
    if (this.has(name)) {
      return super._get(name)
    }

    const store = new Store<IProviderEntry>(name, ProviderStore.storeOptions)
    super._set(name, store)

    return store
  }
}

export {
  ProviderStore
}
