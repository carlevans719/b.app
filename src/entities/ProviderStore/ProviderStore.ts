import { IProviderStatic, IProvider, IProviderStore, IRegisterOptions } from '../../common/interfaces/provider'
import { IApplication } from '../../common/interfaces/application'
import { Store } from '../Store/Store'
import { ProviderConflictError } from './errors/ProviderConflictError'
import { ProviderNotFoundError } from './errors/ProviderNotFoundError'
import { required as r } from '../../common/decorators/parameters'

/**
 * A datastore for Providers
 *
 * @class ProviderStore
 * @extends {Store}
 */
class ProviderStore extends Store <IProvider> implements IProviderStore  {
  __application: IApplication
  
  /**
   * Creates an instance of ProviderStore.
   *
   * @param {IApplication} application 
   * @param {any} options 
   * @memberof ProviderStore
   */
  constructor (application: IApplication = r('application'), options = r('options')) {
    const storeOptions = {
      errors: {
        ItemConflictError: ProviderConflictError,
        ItemNotFoundError: ProviderNotFoundError
      }
    }

    super('providers', storeOptions)

    this.__application = application
  }

  /**
   * Register a new Provider 
   *
   * @param {string} name The name of the Provider
   * @param {IProviderStatic} ProviderCtor A reference to the Provider
   * @param {IRegisterOptions} [options] Optional, additional options
   * @returns {boolean} true, on success
   * @memberof ProviderStore
   */
  register (name: string = r('name'), ProviderCtor: IProviderStatic = r('ProviderCtor'), options: IRegisterOptions = {}) {
    const provider = new ProviderCtor(this.__application)
    this.set(name, provider, options.allowOverwrite)
  }
}

export {
  ProviderStore
}
