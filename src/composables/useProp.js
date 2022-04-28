import { DateTime } from 'luxon'

export const useProp = (type, defaults = null, required = false, validator = null) => {
  return {
    type: type,
    default: defaults === null ? createDefaults(type) : defaults,
    required: required,
    validator: validator
  }
}

const createDefaults = (type) => {
  switch (type) {
    case Boolean: return false
    case Object: return () => { return {} }
    case Array: return () => { return [] }
    case Date: return DateTime.now()
    case Number: return 0
    default: return ''
  }
}
