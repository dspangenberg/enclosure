import { getData, setData } from '@/api/axios'

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

  const verifyAccountCredentials = async () => {
    const result = await axios.get('/accounts/verify_credentials')
    const data = getData(result)
    return data
  }

  return {
    fetchAccessToken,
    verifyAccountCredentials
  }
}
