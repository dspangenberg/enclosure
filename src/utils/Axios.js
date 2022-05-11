import { url } from '@vuelidate/validators'
import axios from 'axios'
import axiosHelper from 'axios-helpers'
import { snakeCase, camelCase, pick } from 'lodash'
import queryString from 'query-string'

const $axios = axiosHelper(axios)

// "<https://mastodon.social/api/v1/timelines/home?limit=40&max_id=108277821215643575>; rel="next",
// <https://mastodon.social/api/v1/timelines/home?limit=40&min_id=108278667555976629>; rel="prev""

const processResults = (result) => {
  const headers = pick(result.headers, ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'link'])
  let params = null
  if (headers.link) {
    const regex = /(<(.*?)>)([^,]+)(?<name>next)/g
    const result = regex.exec(headers.link)
    if (result?.length > 1) {
      const url = new URL(result[2])
      params = Object.fromEntries(url.searchParams)
    }
  }
  return {
    data: result.data,
    next: params
  }
}

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

export { $axios, setQueryString, getData, setData, queryString, processResults }
