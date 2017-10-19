import { IStore } from './store'
import { IApplication } from './application'

interface IProviderStatic {
  new (application: IApplication) : IProvider
}

interface IProvider {

}

interface IProviderStore extends IStore <IProvider> {
  // (protected) __application: IApplication
}

interface IRegisterOptions {
  allowOverwrite?: boolean
}

export {
  IProviderStatic,
  IProvider,
  IProviderStore,
  IRegisterOptions
}
