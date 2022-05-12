import { getData, setData } from '@/utils/Axios'
import { useStore } from '@/stores/global'

export const apiAuth = (axios) => {
  const fetchAccessToken = async (code, clientId, clientSecret, redirectUri, scope = ['read', 'write', 'follow', 'push']) => {
    const params = setData({
      clientId,
      clientSecret,
      scope,
      code,
      redirectUri,
      grant_type: 'authorization_code'
    })
    const result = await axios.post('/oauth/token', params)
    const data = getData(result)
    return data
  }

  const revokeAccessToken = async (account = null) => {
    const store = useStore()
    account = account || await store.ensureAccount()
    const result = await axios.post('/oauth/revoke Revoke', {
      client_id: account.clientId,
      client_secret: account.clientSecret,
      token: account.accessToken
    })
    const data = getData(result)
    return data
  }

  const verifyAccountCredentials = async () => {
    const result = await axios.get('/accounts/verify_credentials')
    const data = getData(result)
    return data
  }

  return {
    fetchAccessToken,
    revokeAccessToken,
    verifyAccountCredentials
  }
}
