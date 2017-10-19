import { IStore } from './store'
import { IProvider } from './provider'

interface IApplication {
  providers: IStore<IProvider>
}

export {
  IApplication
}
