import { SpecialistName, SpecialistTuple, SpecialistUnion, SpecialistUnionArray } from '../interfaces/application'

function isSpecialistConfigOnly (data: any): data is any {
  return !Array.isArray(data) && data !== null && typeof data === 'object'
}

function isSpecialistName (data: any): data is SpecialistName {
  return Array.isArray(data) && data.length === 1 && typeof data[0] === 'string'
}

function isSpecialistTuple (data: any): data is SpecialistTuple {
  return Array.isArray(data) &&
    data.length === 2 &&
    typeof data[0] === 'string' &&
    typeof data[1] === 'object' &&
    data[1] !== null
}

function isSpecialistUnion (data: any): data is SpecialistUnion {
  // e.g. ['foo', {}] or ['foo']
  return isSpecialistName(data) || isSpecialistTuple(data)
}

function isSpecialistUnionArray (data: any): data is SpecialistUnionArray {
  return Array.isArray(data) && data.every(isSpecialistUnion)
}

export {
  isSpecialistConfigOnly,
  isSpecialistName,
  isSpecialistTuple,
  isSpecialistUnion,
  isSpecialistUnionArray
}
