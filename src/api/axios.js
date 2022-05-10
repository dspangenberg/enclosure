import axios from 'axios'
import axiosHelper from 'axios-helpers'
import { snakeCase, camelCase } from 'lodash'
import queryString from 'query-string'

const $axios = axiosHelper(axios)

const setData = data => {
  const object = {}
  for (const [key, value] of Object.entries(data)) {
    object[snakeCase(key)] = value
  }
  return object
}

const setQueryString = data => {
  const object = {}
  for (const [key, value] of Object.entries(data)) {
    object[snakeCase(key)] = encodeURI(value)
  }
  return queryString.stringify(object)
}

const getData = data => {
  if (!data.data) return null
  const object = {}
  for (const [key, value] of Object.entries(data.data)) {
    object[camelCase(key)] = value
  }
  return object
}

export { $axios, setQueryString, getData, setData, queryString }
