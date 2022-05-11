import { getData, setData, queryString } from '@/utils/Axios'

export const apiApp = (axios) => {
  const registerApp = async (clientName, website, redirectUris = null, scopes = ['read', 'write', 'follow', 'push']) => {
    const result = await axios.post('apps', setData({ clientName, website, redirectUris, scopes: scopes.join(' ') }))
    const { clientId, clientSecret, vapidKey } = getData(result)
    const params = Object.assign({}, result.data)

    delete params.client_secret
    delete params.id
    delete params.name
    delete params.vapid_key
    delete params.website

    params.response_type = 'code'
    params.scope = scopes.join(' ')

    const qs = queryString.stringify(params)

    const { origin } = new URL(axios.defaults.baseURL)
    const url = `${origin}/oauth/authorize/?${qs}`
    const data = { clientId, clientSecret, redirectUris, vapidKey, url }
    return data
  }

  return {
    registerApp
  }
}
