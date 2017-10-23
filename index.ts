import { Application as App } from '@webantic/w.interfaces'
import { IIndexable } from '@webantic/w.interfaces/decorators'
import { IProvider, IProviderStore, IRegisterOptions } from '@webantic/w.interfaces/providers'

import { required as r } from './common/decorators/parameters'
import { InvalidParameterError } from './common/errors/InvalidParameterError'
import * as types from './common/typeCheckers/application'
import { ProviderStore } from './entities/ProviderStore/ProviderStore'

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
        let ProviderCtor = require(`@webantic/w.providers/entities/${entry[0]}`)
        ProviderCtor = 'default' in ProviderCtor ? ProviderCtor.default : ProviderCtor

        this.providers.register(
          entry[0],
          ProviderCtor,
          {
            ...(types.isSpecialistTuple(entry) ? entry[1] : {}),
            groupName: providerType
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

    for (const providerType in manifest) {
      if (manifest.hasOwnProperty(providerType)) {
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
            let ProviderCtor = require(`@webantic/w.providers/entities/${providerType}`)
            ProviderCtor = 'default' in ProviderCtor ? ProviderCtor.default : ProviderCtor

            const base: IRegisterOptions = {}
            if (ProviderCtor.groupName) {
              base.groupName = ProviderCtor.groupName
            }

            const providerConfig = Object.assign(base, providers)
            this.providers.register(providerType, ProviderCtor, providerConfig)

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
}

export {
  Application
}
