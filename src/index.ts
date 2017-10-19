import { IApplication } from './common/interfaces/application'
import { IStore } from './common/interfaces/store'
import { IProvider } from './common/interfaces/provider'
import { ProviderStore } from './entities/ProviderStore/ProviderStore'

class Application implements IApplication {
  providers: IStore<IProvider>

  constructor () {
    this.providers = new ProviderStore(this)
  }
}

export {
  Application
}
