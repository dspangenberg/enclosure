import supermodels from 'supermodels.js'
import { DateTime } from 'luxon'

const now = DateTime.now().toFormat('YYYY-MM-DD HH:mm:ss')

const prop = supermodels.prop()
prop.register('required', function () {
  return function (val, name) {
    if (!val) {
      return name + ' is required'
    }
  }
})

const baseSchema = (schema, isSubDocument = false) => {
  let base
  if (isSubDocument) {
    base = {
      createdAt: prop(Date).value(now),
      updatedAt: prop(Date).value(now)
    }
  } else {
    base = {
      id: String,
      _id: String,
      _rev: String,
      _deleted: prop(Boolean).value(false),
      docType: String,
      createdAt: prop(Date).value(now),
      updatedAt: prop(Date).value(now)
    }
  }

  const extSchema = Object.assign({}, base, schema)
  const model = supermodels(extSchema)
  return model
}

export default baseSchema
export { prop }
