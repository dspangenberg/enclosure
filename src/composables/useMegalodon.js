import { ref, computed } from 'vue'
import generator, { detector } from 'megalodon'

export async function useMegalodon () {
  const protocol = 'https'
  const appName = 'enclosure'
  const appUrl = 'https://github.com/dspangenberg/enclosure'
  const redirect = 'http://localhost:3000/auth/autorize'
  const scopes = ['read', 'write', 'follow', 'push']
  const sns = ref(null)
  const domain = ref('')
  const accessToken = ref(null)
  const client = ref(null)

  const baseUrl = computed(() => `${protocol}://${domain.value}`)
  const setDomain = (value) => { domain.value = value.trim() }

  const detectSns = async () => {
    sns.value = await detector(`${protocol}://${domain.value}`)
  }

  const generateClient = async () => {
    if (!sns.value) await detectSns
    client.value = generator(sns.value, baseUrl.value, accessToken.value, 'enclosure')
  }

  const ensureClient = async () => {
    if (!client.value) {
      await generateClient()
    }
  }

  const fetchAccessToken = async (code, account) => {
    setDomain(account.domain)
    await ensureClient()
    const res = await client.value.fetchAccessToken(account.clientId, account.clientSecret, code, redirect)
    accessToken.value = res.accessToken
    client.value = null
    return res
  }

  const verifyAccountCredentials = async () => {
    await ensureClient()
    const res = await client.value.verifyAccountCredentials()
    return res
  }

  const registerApp = async (domain) => {
    setDomain(domain)
    await ensureClient()
    const res = await client.value.registerApp(appName, {
      website: appUrl,
      redirect_uris: redirect,
      scopes: scopes
    })
    return res
  }

  return { setDomain, generateClient, registerApp, fetchAccessToken, sns, verifyAccountCredentials, baseUrl, client, domain }
}
