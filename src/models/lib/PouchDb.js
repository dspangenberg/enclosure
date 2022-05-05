import { toHash } from 'ajv/dist/compile/util'
import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'

PouchDB.plugin(PouchFind)

const PouchDb = class PouchDb {
  constructor (db = 'enclosure') {
    this.$pouch = new PouchDB(db)
  }

  static db (db = 'enclosure') {
    const instance = new this()
    instance.$pouch = new PouchDB(db)
    return instance
  }

  async info () {
    try {
      const info = await this.$pouch.info()
      return Promise.resolve(info)
    } catch (error) {
      return Promise.reject(error)
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

  async getIndex (name) {
    const allDocs = await this.$pouch.allDocs({ include_docs: true })
    const indizies = allDocs.rows.filter(item => item.id.startsWith('_design'))
    for (const index of indizies) {
      if (Object.keys(index.doc.views)[0] === name) {
        return '**' + index.id
      }
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
      { fields: ['docType', 'createdAt'] },
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
      record = await this.$pouch.get(id, options)
    } catch (error) {
      if (error.statusCode === 404) {
        return Promise.resolve(null)
      }
      return Promise.reject(error)
    }
    return Promise.resolve(record)
  }

  async findOne (docType, selectors = {}, options = {}) {
    let records
    try {
      records = await this.find(docType, selectors, options)
    } catch (error) {
      Promise.reject(error)
    }

    return records[0]
  }

  async remove (doc) {
    try {
      await this.$pouch.remove(doc)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async bulkRemove (docs) {
    try {
      for (const doc of docs) {
        await this.$pouch.remove(doc)
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async bulkRemoveByDocType (docType = null) {
    try {
      const ids = await this.getAllIds(true, docType)
      if (ids && ids.length) {
        const docs = await this.getAllByIds(ids)
        if (docs && docs.length) {
          await this.bulkRemove(docs)
        }
        return Promise.resolve(docs.length)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteBy (_id) {
    try {
      const doc = await this.$pouch.get(_id)
      if (doc) {
        await this.$pouch.remove(doc)
        return Promise.resolve()
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async find (docType = null, selectors = {}, options = {}) {
    if (docType !== null) {
      selectors.docType = docType
    }

    try {
      await this.ensureIndexes()
    } catch (error) {
      return Promise.reject(error)
    }

    const query = Object.assign({}, options)
    query.selector = selectors

    let records
    try {
      records = await this.$pouch.find(query)
    } catch (error) {
      return Promise.reject(error)
    }
    return Promise.resolve(records.docs)
  }

  async getAllIds (withRev = false, docType = null) {
    let allDocs
    try {
      allDocs = await this.$pouch.allDocs()
    } catch (error) {
      return Promise.resolve(error)
    }

    if (!allDocs && !allDocs.rows.length) {
      return null
    }

    let maped = allDocs.rows.map(item => {
      return { id: item.id, rev: item.value.rev }
    })

    if (docType) {
      maped = maped.filter(item => item.id.startsWith(`${docType}--`))
    } else {
      maped = maped.filter(item => !item.id.startsWith('_design'))
    }

    return withRev ? maped : maped.map(item => item.id)
  }

  async getAllByIds (docs) {
    try {
      const result = await this.$pouch.bulkGet({ docs: docs })
      const resultDocs = result.results.map(item => item.docs[0].ok)

      return Promise.resolve(resultDocs)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async bulk (docs) {
    try {
      await this.$pouch.bulk({ docs: docs })
    } catch (error) {
      Promise.reject(error)
    }
    Promise.resolve(true)
  }

  async insert (doc) {
    try {
      await this.$pouch.insert(doc)
    } catch (error) {
      Promise.reject(error)
    }
    Promise.resolve(true)
  }

  async save (record) {
    await this.ensureIndexes()

    const data = record
    let result

    try {
      result = await this.$pouch.put(data)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default PouchDb
