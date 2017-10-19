import { IProviderStore } from './provider'

interface IApplication {
  providers: IProviderStore
}

interface IOptions {
  resumeOnError?: boolean
}

interface IProviderManifestEntry {
  [abstractProviderName: string]: SpecialistUnionArray|any
}

type SpecialistName = [string]
type SpecialistTuple = [string, any]
type SpecialistUnion = (SpecialistName|SpecialistTuple)
type SpecialistUnionArray = SpecialistUnion[]

export {
  IApplication,
  IOptions,
  IProviderManifestEntry,
  SpecialistName,
  SpecialistTuple,
  SpecialistUnion,
  SpecialistUnionArray
}
