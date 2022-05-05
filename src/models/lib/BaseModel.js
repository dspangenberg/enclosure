/* eslint-disable no-prototype-builtins */

import PouchDb from './PouchDb'
import baseSchema, { prop } from './BaseSchema'
import { kebabCase } from 'lodash'
import { customAlphabet } from 'nanoid/async'
import { splitArrayIntoChunksOfLen } from '@/utils/StringHelper.js'

const nanoid = customAlphabet('1234567890abcdef', 20)

class BaseModel {
  constructor (data = null, docType = null, docId = null) {
    this.docType = kebabCase(docType) || kebabCase(this.constructor.getDocType())
    this.$pouch = PouchDb.db()
    if (data === null) {
      data = {
        docType: this.docType
      }
    } else {
      data.docType = data.docType || this.docType
    }

    let result
    try {
      result = this.schematize(data)
    } catch (error) {
      Promise.reject(error)
    }

    if (data._rev) {
      result._rev = data._rev
    }

    Object.assign(this, result)
  }

  static prop (value) {
    return prop(value)
  }

  static db () {
    const instance = new this()
    instance.$pouch = PouchDb.db()
    return instance
  }

  static resultFactory (result) {
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

  async beforeSave (data) {
    return Promise.resolve(data)
  }

  async makeId () {
    const id = splitArrayIntoChunksOfLen(await nanoid(), 4).join('-')
    const _id = `${this.docType}--${id}`
    return { id, _id }
  }

  async save (options = {}) {
    const data = Object.assign({}, JSON.parse(JSON.stringify(this)))

    if (!data._id) {
      const { id, _id } = await this.makeId()
      data.id = id
      data._id = _id
    }

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

    let record = await this.beforeSave(data)

    const now = new Date()
    if (!record.createdAt && !this._rev) {
      record.createdAt = now
    }

    record.updatedAt = now

    let result
    let savedRecord

    record = this.schematize(record)

    console.log(record)

    try {
      result = await this.$pouch.save(record)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }

    if (result.ok) {
      try {
        savedRecord = await this.$pouch.get(result.id)
      } catch (error) {
        Promise.reject(error)
      }
    }

    Object.assign(this, savedRecord)
    return Promise.resolve(this)
  }

  async find (selectors = {}, options = {}) {
    console.log(selectors, options)
    try {
      const records = await this.$pouch.find(this.docType, selectors, options)
      return Promise.resolve(records)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  static async findOne (selectors = {}, options = {}) {
    let records
    try {
      records = await this.$pouch.findOne(this.getDocType, selectors, options)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return this.resultFactory(records)
  }

  static async get (id, options = {}) {
    const _id = `${this.docType}--${id}`
    try {
      const record = await this.$pouch.get(_id, options)
      return this.resultFactory(record)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  static instance () {
    return new this(this)
  }

  schematize (data) {
    const Schema = baseSchema(this.constructor.schema)
    return Schema(data)
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

  fabric (data) {
    if (data instanceof Object) {
      console.log(data)
      const doc = new this.constructor(this.schematize(data))
      return doc
    }

    if (Object.prototype.toString.call(data) === '[object Array]') {
      data.forEach((item, index) => {
        console.log('****', index)
        data[index] = this.fabric(item)
      })
      return data
    }
    console.log('*****')
  }

  async first (selector = {}) {
    // const sort = ['createdAt']
    // const index = await this.$pouch.getIndex('docType.createdAt')
    //  sort: [sort], use_index: index
    try {
      const docs = await this.find(selector, { limit: 1 })
      if (docs) {
        const doc = this.fabric(docs[0])
        return Promise.resolve(doc)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getAllIds (withRev = false) {
    try {
      const ids = await this.$pouch.getAllIds(withRev, this.docType)
      return Promise.resolve(ids)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  static async getAllByIds (ids) {
    try {
      const docs = await this.$pouchdb.getAllByIds(ids)
      if (docs && docs.length) {
        return Promise.resolve(this.resultFactory(docs))
      }
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
    return Promise.resolve(null)
  }

  resultFactory (result) {
    return result
  }

  static schematize (data) {
    const Schema = baseSchema(this.schema)
    return Schema(data)
  }
}

export default BaseModel
