import PouchDB from 'pouchdb'
import PouchDbFind from 'pouchdb-find'
import { sortBy } from 'lodash'
import sortKeys from 'sort-keys'

PouchDB.plugin(PouchDbFind)

const views = {}

const PouchDb = class PouchDb {
  constructor (db = 'enclosure') {
    this.$pouch = new PouchDB(db)
  }

  static db (db = 'enclosure') {
    const instance = new PouchDb()
    instance.$pouch = new PouchDB(db)
    return instance
  }

  static cb () {
    if (!this.db) {
      this.db()
    }
    return this.db
  }

  async info () {
    try {
      const info = await this.$pouch.info()
      return Promise.resolve(info)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async dbs () {
    const dbs = await this.db.list()
    return dbs
  }

  static async compact (dbName) {
    const result = await this.db.compact(dbName)
    return result
  }

  static async dbExists (db) {
    const dbs = await this.db
    return dbs.includes(db)
  }

  static async dbCreate (db) {
    const result = await this.cb().db.create(db)
    return result.ok
  }

  static async createNotExistingDb (db) {
    const exists = await this.dbExists(db)
    if (!exists) {
      const result = await this.dbCreate(db)
      return result
    }
    return true
  }

  checkConnection () {
    if (!this.db) {
      throw new Error({ error: 'Keine Datenbank ausgewählt' })
    }
  }

  static async importViews () {
    const db = await this.connection()
    const entities = Object.keys(views.default)
    for (const entity of entities) {
      const doc = views.default[entity]
      const design = await db.design(doc)
      await design.save()
    }
  }

  async getIndexes () {
    try {
      const indexes = await this.$pouch.getIndexes()
      return Promise.resolve(indexes)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async ensureIndexes () {
    let existingIndexes = await this.getIndexes()
    if (existingIndexes) {
      existingIndexes = existingIndexes.indexes.map(item => item.name)
    }

    const neededIndexes = [
      { fields: ['_id'] },
      { fields: ['id'] },
      { fields: ['docType'] },
      { fields: ['docType', 'id'] }
    ]

    for (const index of neededIndexes) {
      try {
        const name = index.fields.join('.')
        if (!existingIndexes.includes(name)) {
          await this.createIndex(index.fields)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return Promise.resolve()
  }

  async createIndex (fields) {
    const name = fields.join('.')
    console.log('createIndex', name)
    try {
      await this.$pouch.createIndex({
        index: {
          fields: fields
        },
        name: name
      })
      return Promise.resolve(this)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async get (id, options = {}) {
    let record
    try {
      record = await this.db.get(id, options)
    } catch (error) {
      if (error.statusCode === 404) {
        return Promise.resolve(null)
      }
      return Promise.reject(error)
    }
    return Promise.resolve(record)
  }

  async list (options = {}) {
    let records
    try {
      records = await this.db.list(options)
    } catch (error) {
      Promise.reject(error)
    }

    const data = records.rows.map(item => item.doc)
    return Promise.resolve(data)
  }

  async find (docType, selectors = {}, options = {}) {
    let records
    try {
      records = await this.findAll(docType, selectors, options)
    } catch (error) {
      Promise.reject(error)
    }

    return records[0]
  }

  async query (designName, viewName, keys, includeDocs = true) {
    if (!Array.isArray(keys)) {
      keys = [keys]
    }

    const options = {
      keys: keys,
      include_docs: includeDocs,
      reduce: false
    }

    const result = await this.db.view(designName, viewName, options)
    return result
  }

  async rawQuery (designName, viewName, keys, includeDocs = true, reduce = false, groupLevel = 1) {
    const options = {
      include_docs: includeDocs,
      reduce: reduce
    }

    if (reduce) {
      options.group_level = groupLevel
    }

    if (keys) {
      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      options.keys = keys
    }

    const result = await this.db.view(designName, viewName, options)
    return result
  }

  async rawQueryBetween (designName, viewName, startKey, endKey, includeDocs = true, reduce = false, groupLevel = 1, inclusiveEnd = true) {
    const options = {
      include_docs: includeDocs,
      reduce: reduce,
      start_key: startKey,
      end_key: endKey,
      inclusive_end: inclusiveEnd
    }

    if (reduce) {
      options.group_level = groupLevel
    }

    const result = await this.db.view(designName, viewName, options)
    return result
  }

  async queryBetween (designName, viewName, startKey, endKey, includeDocs = true) {
    const options = {
      startKey: startKey,
      endKey: endKey,
      include_docs: includeDocs,
      reduce: false
    }

    const result = await this.db.view(designName, viewName, options)
    return result
  }

  async fetchRevs (docNames) {
    const result = await this.db.fetchRevs(docNames)
    return result
  }

  async destroy (id, rev) {
    const result = await this.db.destroy(id, rev)
    return result
  }

  async findAll (docType, selectors = {}, options = {}) {
    console.log(docType)
    if (docType !== null) {
      selectors.docType = docType
    }

    try {
      await this.ensureIndexes()
    } catch (error) {
      console.error(error)
    }

    options.limit = options.limit ? options.limit : 10000

    const query = Object.assign({}, options)
    query.selector = selectors

    console.log(query)

    let records
    try {
      records = await this.$pouch.find(query)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return Promise.resolve(records.docs)
  }

  static async getAllIds (selector, field) {
  }

  async getAllByIds (ids, options) {
    try {
      const result = await this.db.fetch(
        {
          keys: ids
        }
      )
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async bulk (docs) {
    try {
      await this.db.bulk({ docs: docs })
    } catch (error) {
      Promise.reject(error)
    }
    Promise.resolve(true)
  }

  async insert (doc) {
    try {
      await this.db.insert(doc)
    } catch (error) {
      Promise.reject(error)
    }
    Promise.resolve(true)
  }

  async save (record) {
    const data = sortKeys(record, { deep: true })

    let result

    try {
      result = await this.db.put(data)
      Promise.resolve(result)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }

    return Promise.resolve(result)
  }
}

export default PouchDb
