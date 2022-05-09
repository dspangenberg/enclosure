import $axios from './axios'
import { snakeCase, camelCase } from 'lodash'
import queryString from 'query-string'

// https://mastodon.social/api/v1/

export const mastoApi = (baseUrl = null, authToken = null) => {
  let axios

  const setData = data => {
    const object = {}
    for (const [key, value] of Object.entries(data)) {
      object[snakeCase(key)] = value
    }
    console.log(object)
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
    console.log(object)
    return object
  }

  const setAuthToken = (authToken) => {
    console.log(authToken)
    $axios.setToken(authToken, 'Bearer')
    console.log($axios)
  }

  const connect = (baseUrl, authToken = null) => {
    $axios.setBaseURL(baseUrl)
    console.log(authToken)
    if (authToken) {
      setAuthToken(authToken)
    }
    return $axios
  }

  const registerApp = async (clientName, website, redirectUris = null, scopes = ['read', 'write', 'follow', 'push']) => {
    const result = await axios.post('apps', setData({ clientName, website, redirectUris, scopes: scopes.join(' ') }))
    console.log(result.data)
    const { clientId, clientSecret, vapidKey } = getData(result)
    const params = Object.assign({}, result.data)

    delete params.client_secret
    delete params.id
    delete params.name
    delete params.vapid_key
    delete params.website

    params.response_type = 'code'
    params.force_login = true
    params.scope = scopes.join(' ')

    const qs = queryString.stringify(params)

    const { origin } = new URL(axios.defaults.baseURL)
    const url = `${origin}/oauth/authorize/?${qs}`
    const data = { clientId, clientSecret, redirectUris, vapidKey, url }
    return data
  }

  const fetchAccessToken = async (code, clientId, clientSecret, redirectUri, scope = ['read', 'write', 'follow', 'push']) => {
    const params = setData({
      clientId,
      clientSecret,
      scope,
      code,
      redirectUri,
      grant_type: 'authorization_code'
    })
    console.log(params)
    const result = await axios.post('/oauth/token', params)
    const data = getData(result)
    console.log(data)
    return data
  }

  const verifyAccountCredentials = async () => {
    const result = await axios.get('/accounts/verify_credentials')
    const data = getData(result)
    console.log(data)
    return data
  }

  axios = connect(baseUrl, authToken)

  return {
    connect,
    registerApp,
    fetchAccessToken,
    verifyAccountCredentials
  }
}
