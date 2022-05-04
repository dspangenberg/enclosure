/* eslint-disable no-prototype-builtins */

import PouchDb from './PouchDb'
import baseSchema, { prop } from './BaseSchema'
import { kebabCase } from 'lodash'
import { DateTime } from 'luxon'
import { uuid } from 'uuidv4'
import { createSharedComposable } from '@vueuse/core'

const BaseModel = class BaseModel {
  constructor (data = null, docType = null, docId = null) {
    if (docType === null) {
      docType = this.getIdocType
      console.log(docType)
    }

    /*

    if (data === null) {
      const id = (docId === null) ? uuid() : docId
      Object.assign(this, {
        docType: docType,
        id: id,
        _id: docType + '--' + id
      })
      return this
    }


    if (data instanceof Object) {
      if (!data.docType) data.docType = docType
      if (!data.id) data.id = (docId === null) ? uuid() : data.id
      if (!data._id) data._id = docType + '--' + data.id
    }


    let result
    try {
      result = this.constructor.schematize(data)
    } catch (error) {
      Promise.reject(error)
    }

    if (data._rev) {
      result._rev = data._rev
    }

    Object.assign(this, result)
    */
  }

  db (db) {
    this.$database = db
    return this
  }

  static db () {
    const instance = new BaseModel()
    instance.$pouch = PouchDb.db()
    return instance
  }

  static prop (value) {
    return prop(value)
  }

  static transforms (name) {
    const transforms = {
      // strip: (value) => stripTags(value)
    }

    if (transforms[name] === undefined) {
      return name
    }
    return transforms[name]
  }

  static transform (array, transforms) {
    array.map(item => {
      transforms.forEach(entry => {
        const { field, func } = this.splitParams(entry)
        if (typeof field === 'function') {
          const run = field
          item[func] = run(item[func])
        } else {
          const run = this.transforms(field)
          item[func] = run(item[func])
        }
      })
      return item
    })
    return array
  }

  static create (data, transform = true, docId) {
    const docType = this.getDocType

    if (transform) {
      data.docType = docType
      data.id = (docId === null) ? uuid() : docId
      data._id = docType + '--' + (docId === null) ? uuid() : docId
    }

    const result = this.schematize(data)
    return result
  }

  static init (object = {}, toObject = false) {
    const instance = new this(null)
    const schemObject = this.schematize(object)
    const result = instance.resultFactory(schemObject)
    if (result === undefined) {
      return {}
    }
    if (toObject === true) {
      return result.toObject()
    }
    return result
  }

  async beforeSave (data) {
    return Promise.resolve(data)
  }

  async save (options = {}) {
    const now = new Date() // moment().format('YYYY-MM-DD HH:mm_ss')
    const data = Object.assign({}, JSON.parse(JSON.stringify(this)))

    if (data._rev && data._id) {
      try {
        const record = await PouchDb.db(this.$database).get(data._id)
        if (record !== null) {
          data._rev = record._rev
        }
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    }

    const record = await this.beforeSave(data)

    const schema = this.constructor.schema
    const fields = Object.keys(schema)
    const relations = fields.filter(item => item.includes('$'))

    for (const relation of relations) {
      const field = relation.replace('$', '')
      delete record[field]
    }

    if (!record.createdAt && !this._rev) {
      record.createdAt = now
    }

    record.updatedAt = now

    let result
    let savedRecord

    try {
      result = await PouchDb.db(this.$database).save(record)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }

    if (result.ok) {
      try {
        savedRecord = await PouchDb.db(this.$database).get(result.id)
      } catch (error) {
        Promise.reject(error)
      }
    }

    return Promise.resolve(savedRecord)
  }

  async updateField (key, value) {
    this[key] = value
    this.updatedAt = new Date()
    const result = await this.save()
    Promise.resolve(result)
  }

  async destroy (doc = false) {
    if (doc) {
      await PouchDb.db(this.$database).destroy(doc[0]._id, doc[0]._rev)
    } else {
      await PouchDb.db(this.$database).destroy(this._id, this._rev)
    }
  }

  async trash (id) {
    try {
      const record = await this.get(id)
      record.deletedAt = DateTime().now().toFormat('YYYY-MM-DD HH:mm:ss')
      const result = await record.save()
      Promise.resolve(result)
    } catch (error) {
      Promise.reject(error)
    }
  }

  static fieldsAdapter (fields) {
    if (Object.prototype.toString.call(fields) === '[object String]') {
      const document = {}

      fields = fields.split(/\s+/)
      fields.forEach((field) => {
        if (field) {
          const include = field[0] !== '-'
          if (!include) {
            field = field.slice(1)
          }
          document[field] = include
        }
      })

      fields = document
    }

    return fields
  }

  static get schema () {
    return {}
  }

  static schematize (data) {
    const Schema = baseSchema(this.schema)
    return Schema(data)
  }

  static get getDocType () {
    return kebabCase(this.name)
  }

  get getIdocType () {
    return kebabCase(this.constructor.getDocType)
  }

  set getIdocType (name) {
  }


  static async findAll (selectors = {}, options = {}) {
    let records
    try {
      records = await PouchDb.db().findAll(this.getDocType, { deletedAt: { $eq: null } }, options)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return this.resultFactory(records)
  }

  async findAll (selectors = {}, options = {}, deleted = false) {
    let records
    try {
      if (deleted === false) {
        selectors.deletedAt = { $eq: null }
      }

      console.log(this.constructor.getDocType)

      records = await this.$pouch.findAll(this.getIdocType, selectors, options)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    const results = this.resultFactory(records)
    return results
  }

  async get (id, options = {}) {
    let record
    try {
      record = await this.couch.get(id)
    } catch (error) {
      return Promise.reject(error)
    }

    if (record === null) {
      return Promise.resolve(null)
    }
    const results = this.resultFactory(record)
    return Promise.resolve(results)
  }

  static async getDefault () {
    let records
    try {
      records = await PouchDb.findOne(this.getDocType, {
        isDefault: true
      })
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return records._id
  }

  async find (selectors = {}, options = {}, deleted = false) {
    let records
    try {
      if (deleted === false) {
        // selectors.deletedAt = {$eq: null}
      }
      records = await this.couch.find(this.getIdocType, selectors, options)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    const results = this.resultFactory(records)
    return results
  }

  async getByLid (lid) {
    let results
    try {
      results = await this.find({
        lid: {
          $eq: lid
        }
      })
    } catch (error) {
      console.log(error)
    }

    return results
  }

  static instance () {
    return new this(this)
  }

  static toClassObject (object) {
    return this.resultFactory(object)
  }

  toObject () {
    const computes = this.constructor.computes
    const object = Object.assign({}, this)
    if (computes !== undefined) {
      for (const name of computes) {
        const property = this[name]
        object[name] = property
      }
    }
    return object
  }

  static splitParams (params) {
    const pair = Object.entries(params)[0]
    const payload = {
      field: pair[1],
      property: pair[0],
      func: pair[0]
    }

    if (Array.isArray(pair[1])) {
      payload.property = pair[1][1]
      payload.field = pair[1][0]
    }

    return payload
  }

  async query (designName, viewName, keys, includeDocs = true) {
    const result = await this.couch.query(designName, viewName, keys, includeDocs)

    const rows = result.rows.map(item => item.doc)
    const records = this.resultFactory(rows)
    return records
  }

  async rawQuery (designName, viewName, keys, includeDocs = true, reduce = false, groupLevel = 1) {
    const result = await this.couch.rawQuery(designName, viewName, keys, includeDocs, reduce)
    return result
  }

  async rawQueryBetween (designName, viewName, startKey, endKey, includeDocs = true, reduce = false, groupLevel = 1, inclusiveEnd = true) {
    const result = await this.couch.rawQueryBetween(designName, viewName, startKey, endKey, includeDocs, reduce, groupLevel, inclusiveEnd)
    return result
  }

  async queryBetween (designName, viewName, startKey, endKey, includeDocs = true) {
    const result = await this.couch.queryBetween(designName, viewName, startKey, endKey, includeDocs)
    const rows = result.rows.map(item => item.value)

    // const records = this.resultFactory(rows)
    return rows
  }

  static async getAllIds (selector, field) {
    selector.docType = this.getDocType
    let ids
    try {
      ids = await PouchDb.getAllIds(selector, field)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return ids
  }

  async getAllByIds (ids, options) {
    let records
    try {
      const result = await this.couch.getAllByIds(ids, options)
      const rows = result.rows.map(item => item.doc)
      records = this.resultFactory(rows)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return records
  }

  static async getAllByIdsRaw (ids, options) {
    let records
    try {
      records = await PouchDb.getAllByIds(ids, options)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return records
  }

  resultFactory (result) {
    if (Object.prototype.toString.call(result) === '[object Array]') {
      result.forEach((item, index) => {
        result[index] = new this.constructor(this.db, item)
      })
    }

    if (Object.prototype.toString.call(result) === '[object Object]') {
      if (result.hasOwnProperty('value') && !result.hasOwnProperty('_id')) {
        if (result.value) {
          result = new this.constructor(this.db, result.value)
        } else {
          result = undefined
        }
      } else if (result.hasOwnProperty('ops')) {
        result.ops.forEach((item, index) => {
          result.ops[index] = new this.constructor(this.db, item)
        })

        result = result.ops
      } else if (result.hasOwnProperty('_id')) {
        result = new this.constructor(this.db, result)
      }
    }
    return result
  }
}

export default BaseModel
