import { ref } from 'vue'
import generator, { detector } from 'megalodon'
import { useStore } from '@/stores/global'

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
  const apiLoading = ref(false)

  const baseUrl = ref(null)

  const setDomain = (value) => {
    domain.value = value.trim()
    baseUrl.value = `${protocol}://${domain.value}`
  }

  const setLoading = (value = false) => {
    const store = useStore()
    store.setIsLoading(value)
  }

  const bookmarkStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.bookmarkStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const unbookmarkStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.unbookmarkStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const reblogStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.reblogStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const unreblogStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.unreblogStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const favouriteStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.favouriteStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const unfavouriteStatus = async (id) => {
    await ensureClient()
    try {
      const res = await client.value.unfavouriteStatus(id)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getTimeline = async (type = 'home', options = {}, id = null, tag = null) => {
    setLoading()
    const account = await ensureClient()
    if (id === null) {
      id = account?.accountId
    }
    try {
      let res
      switch (type) {
        case 'home':
          res = await client.value.getHomeTimeline(options)
          break
        case 'favorites':
          res = await client.value.getFavourites(options)
          break
        case 'bookmarks':
          res = await client.value.getBookmarks(options)
          break
        case 'profile':
          res = await client.value.getAccountStatuses(id, options)
          break
        case 'local':
          res = await client.value.getLocalTimeline(options)
          break
        case 'federation':
          res = await client.value.getPublicTimeline(options)
          break
        case 'conversations':
          res = await client.value.getConversationTimeline(options)
          break
        case 'tags':
          console.log('tags', tag)
          if (tag) {
            res = await client.value.getTagTimeline(tag, options)
          }
          break
      }
      setLoading()
      return Promise.resolve(res.data)
    } catch (error) {
      setLoading()
      return Promise.reject(error)
    }
  }

  const getInstanceTrends = async (limit = 10) => {
    await ensureClient()
    try {
      const res = await client.value.getInstanceTrends(limit)
      setLoading()
      return Promise.resolve(res.data)
    } catch (error) {
      setLoading()
      return Promise.reject(error)
    }
  }

  const getAccountStatuses = async (accountId = null) => {
    const store = useStore()
    const { account } = store
    if (!accountId && account?.accountId) {
      accountId = account.accountId
    }
    await ensureClient(account)
    try {
      const res = await client.value.getAccountStatuses(accountId)
      setLoading(false)
      return Promise.resolve(res.data)
    } catch (error) {
      setLoading(false)
      return Promise.reject(error)
    }
  }

  const getFavourites = async () => {
    const store = useStore()
    await ensureClient(store.getAccount())
    try {
      const res = await client.value.getFavourites()
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getBookmarks = async () => {
    const store = useStore()
    await ensureClient(store.getAccount())
    try {
      const res = await client.value.getBookmarks()
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
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

  const ensureClient = async (account = null) => {
    const store = useStore()
    if (account === null) account = store.ensureAccount()
    if (!client.value) {
      try {
        await generateClient(account)
        return account
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return account
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

  const verifyAccountCredentials = async (account) => {
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

  return {
    apiLoading,
    baseUrl,
    sns,
    client,
    domain,
    bookmarkStatus,
    favouriteStatus,
    fetchAccessToken,
    getAccount,
    getAccountStatuses,
    getBookmarks,
    getFavourites,
    getInstanceTrends,
    getTimeline,
    generateClient,
    reblogStatus,
    registerApp,
    setDomain,
    unbookmarkStatus,
    unfavouriteStatus,
    unreblogStatus,
    verifyAccountCredentials
  }
}
