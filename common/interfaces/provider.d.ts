import { IStore, IStoreGetItemOptions } from './store'
import { IApplication } from './application'

interface IProviderStatic {
  new (application: IApplication, config?: IProviderEntry['config']) : IProvider
}

interface IProvider {
  
}

interface IProviderEntry {
  initialised: boolean
  instance?:   IProvider
  Ctor:        IProviderStatic
  config:      any
}

interface IProviderStore {
  // (protected) __application: IApplication
  get (name: string, groupName: string, options: IStoreGetItemOptions): IProvider

  register (name: string, ProviderCtor: IProviderStatic, options?: IRegisterOptions) : void
}

interface IProviderStoreOptions {
  defaultGroupName?: string
}

interface IRegisterOptions {
  allowOverwrite?: boolean
  groupName?:      string
  initialise?:     boolean
  config?:         IProviderEntry['config']
}

export {
  IProviderStatic,
  IProvider,
  IProviderEntry,
  IProviderStore,
  IProviderStoreOptions,
  IRegisterOptions
}
