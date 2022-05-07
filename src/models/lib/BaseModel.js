/* eslint-disable no-prototype-builtins */

import PouchDb from './PouchDb'
import baseSchema, { prop } from './BaseSchema'
import { kebabCase } from 'lodash'
import { customAlphabet } from 'nanoid/async'
import { splitArrayIntoChunksOfLen } from '@/utils/StringHelper.js'

const nanoid = customAlphabet('1234567890abcdef', 20)
const $pouch = PouchDb.db()

class BaseModel {
  constructor (data = null, docType = null, docId = null) {
    const Schema = baseSchema(this.constructor.schema)

    this.docType = kebabCase(docType) || kebabCase(this.constructor.getDocType())
    if (data === null) {
      data = {
        docType: this.docType
      }
    } else {
      if (!data.docType) {
        data.docType = data.docType || this.docType
      }
    }

    try {
      data = Schema(data)
    } catch (error) {
      Promise.reject(error)
    }

    Object.assign(this, data)
  }

  static prop (value) {
    return prop(value)
  }

  static db () {
    const instance = new this()
    return instance
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

  async remove (doc = null) {
    const id = doc ? doc._id : this._id
    $pouch.deleteBy(id)
  }

  async makeId () {
    if (this._id) return
    const id = splitArrayIntoChunksOfLen(await nanoid(), 4).join('-')
    const _id = `${this.docType}--${id}`

    this.id = this.id || id
    this._id = _id

    return { id, _id }
  }

  async save (options = {}) {
    await this.makeId()
    const data = this.toObject()

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

    const now = new Date()
    if (!record.createdAt && !this._rev) {
      record.createdAt = now
    }

    record.updatedAt = now

    let result
    let savedRecord

    try {
      result = await $pouch.save(record)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }

    if (result.ok) {
      try {
        savedRecord = await $pouch.get(result.id)
      } catch (error) {
        Promise.reject(error)
      }
    }

    Object.assign(this, savedRecord)
    return Promise.resolve(this)
  }

  async first (selector = {}, sort = ['createdAt']) {
    try {
      const docs = await this.find(selector, { sort })
      if (docs) {
        const doc = this.resultFactory(docs[0])
        return Promise.resolve(doc)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async find (selectors = {}, options = {}) {
    try {
      const records = await $pouch.find(this.docType, selectors, options)
      console.log(records)
      return Promise.resolve(this.resultFactory(records))
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  async findOne (selectors = {}, options = {}) {
    try {
      const records = await $pouch.findOne(this.getDocType, selectors, options)
      return this.resultFactory(records)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  async get (id, options = {}) {
    const _id = `${this.docType}--${id}`
    try {
      const record = await $pouch.get(_id, options)
      return this.resultFactory(record)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  toObject () {
    const computes = this.constructor.computes
    const object = Object.assign({}, this)
    delete object.$pouch
    if (computes !== undefined) {
      for (const name of computes) {
        const property = this[name]
        object[name] = property
      }
    }
    return object
  }

  resultFactory (result) {
    if (Object.prototype.toString.call(result) === '[object Array]') {
      result.forEach((item, index) => {
        result[index] = new this.constructor(item)
      })
    }

    if (Object.prototype.toString.call(result) === '[object Object]') {
      if (result.hasOwnProperty('value') && !result.hasOwnProperty('_id')) {
        if (result.value) {
          result = new this.constructor(result.value)
        } else {
          result = undefined
        }
      } else if (result.hasOwnProperty('ops')) {
        result.ops.forEach((item, index) => {
          result.ops[index] = new this.constructor(item)
        })

        result = result.ops
      } else if (result.hasOwnProperty('_id')) {
        result = new this.constructor(result)
      }
    }
    return result
  }
}

export default BaseModel
