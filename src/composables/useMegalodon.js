import { ref } from 'vue'
import generator, { detector } from 'megalodon'

export function useMegalodon () {
  const protocol = 'https'
  const appName = 'enclosure'
  const appUrl = 'https://github.com/dspangenberg/enclosure'
  const redirect = 'http://localhost:3000/auth/autorize'
  const scopes = ['read', 'write', 'follow', 'push']
  const sns = ref(null)
  const domain = ref(null)
  const accessToken = ref(null)
  const client = ref(null)

  const baseUrl = ref(null)

  const setDomain = (value) => {
    domain.value = value.trim()
    baseUrl.value = `${protocol}://${domain.value}`
  }

  const detectSns = async () => {
    try {
      sns.value = await detector(`${protocol}://${domain.value}`)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const generateClient = async (account = null) => {
    if (account) {
      setDomain(account.domain)
      accessToken.value = account.accessToken
    }
    if (!sns.value) await detectSns()
    try {
      client.value = generator(sns.value, baseUrl.value, accessToken.value, 'enclosure')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const ensureClient = async (account) => {
    if (!client.value) {
      await generateClient(account)
    }
  }

  const getAccount = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.getAccount(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const fetchAccessToken = async (account, code = null) => {
    if (!code) code = account.accessToken
    setDomain(account.domain)
    await ensureClient()
    try {
      const res = await client.value.fetchAccessToken(account.clientId, account.clientSecret, code, redirect)
      accessToken.value = res.accessToken
      client.value = null
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const verifyAccountCredentials = async (account = null) => {
    await ensureClient(account)
    try {
      const res = await client.value.verifyAccountCredentials()
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const registerApp = async (domain) => {
    setDomain(domain)
    await ensureClient()
    try {
      const res = await client.value.registerApp(appName, {
        website: appUrl,
        redirect_uris: redirect,
        scopes: scopes
      })
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { setDomain, generateClient, registerApp, fetchAccessToken, sns, verifyAccountCredentials, baseUrl, client, domain, getAccount }
}
