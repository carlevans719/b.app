import * as App from './common/interfaces/application'
import { IProviderStore } from './common/interfaces/provider'
import { IIndexable } from './common/interfaces/decorators'
import { InvalidParameterError } from './common/errors/InvalidParameterError'
import { ProviderStore } from './entities/ProviderStore/ProviderStore'
import * as types from './common/typeCheckers/application'
import { required as r } from './common/decorators/parameters'

class Application implements App.IApplication {
  name: string
  providers: IProviderStore

  constructor (name: string = r('name'), manifest: App.IProviderManifestEntry = {}, options: App.IOptions = {}) {
    this.providers = new ProviderStore(this)
    this._processProviderManifest(manifest, options.resumeOnError)
  }

  get (providerName: string = r('providerName')) {
    return this.providers.find(providerName)
  }

  _processProviderManifest (manifest: App.IProviderManifestEntry = {}, resumeOnError = false) {
    const registerUnion = (providerType: string, entry: App.SpecialistUnion) => {
      try {
        const ProviderCtor = require(`b.providers/${entry[0]}`)
        this.providers.register(
          entry[0],
          ProviderCtor,
          {
            groupName: providerType,
            ...(types.isSpecialistTuple(entry) ? entry[1] : {})
          }
        )
      } catch (ex) {
        if (resumeOnError) {
          console.error(ex.message)
        } else {
          throw ex
        }
      }
    }

    for (let providerType in manifest) {
      const providers = manifest[providerType]

      // Manifest item is `key: ['String', {}]` or `key: ['String']`
      if (types.isSpecialistUnion(providers)) {
        registerUnion(providerType, providers)
        continue
      }

      // Manifest item is `key: [['String'] or ['String', {}]]
      if (types.isSpecialistUnionArray(providers)) {
        providers.forEach((entry, idx) => registerUnion(providerType, entry))
        continue
      }

      try {
        // Manifest item is `key: {}`
        if (types.isSpecialistConfigOnly(providers)) {
          const ProviderCtor = require(`b.providers/${providerType}`)
          this.providers.register(providerType, ProviderCtor, providers)
          continue
        } else {
          throw new InvalidParameterError('manifest', `Value for ${providerType} was an unknown format`)
        }
      } catch (ex) {
        if (resumeOnError) {
          console.error(ex.message)
        } else {
          throw ex
        }
      }
    }
  }
}

export {
  Application
}
