import low from 'lowdb'
import lodashId from 'lodash-id'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import Ajv from 'ajv'

const ajv = new Ajv()

const schemaAccount = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    baseUrl: { type: 'string' },
    domain: { type: 'string' },
    sns: { type: 'string' },
    clientId: { type: 'string' },
    clientSecret: { type: 'string' },
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    username: { type: 'string' },
    accountId: { type: 'string' },
    acct: { type: 'string' },
    url: { type: 'string' },
    avatar: { type: 'string' }

  },
  required: ['baseUrl', 'domain', 'clientId', 'clientSecret'],
  additionalProperties: false
}

const validateAccount = ajv.compile(schemaAccount)

const db = () => {
  const adapter = new LocalStorage('enclosure.low')
  const db = low(adapter)

  db.read()
  db._.mixin(lodashId)

  db.defaults({ accounts: [], tags: [] }).write()

  return db
}

const searchAccount = (search) => {
  return db().get('accounts')
    .filter({ search })
    .take(1)
    .value()
}

const accountById = (id) => {
  if (!id) return null
  const accounts = db()
    .defaults({ accounts: [] })
    .get('accounts')

  return accounts.getById(id).value()
}

const firstAccount = () => {
  const accounts = db().get('accounts').value()
  return accounts[0]
}

const upsertAccount = (account) => {
  const valid = validateAccount(account)
  if (!valid) {
    const error = new Error(validateAccount.errors)
    return Promise.reject(error)
  }

  const accounts = db()
    .defaults({ accounts: [] })
    .get('accounts')
  return accounts.upsert(account).write()
}

export { db, upsertAccount, searchAccount, firstAccount, accountById }
