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

  const getRoute = (link, mentions) => {
    const href = link.split('?')
    const parts = href[0].split('/')
    const tagOrMention = parts.pop()

    if (tagOrMention.startsWith('@')) {
      const mention = mentions.find(item => item.username === tagOrMention.substr(1))
      if (mention) {
        return `/app/timeline/profile/${mention.id}`
      } else {
        return null
      }
    } else {
      return `/app/timeline/tags/${tagOrMention}`
    }
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

  const getNotifications = async (options = {}) => {
    await ensureClient()
    try {
      const res = await client.value.getNotifications(options)
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getSuggestions = async (limit = 3) => {
    await ensureClient()
    try {
      const res = await client.value.getSuggestions(limit)
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

  const getTimeline = async (type = 'home', options = {}, p = null, withBubble = false) => {
    console.log('getTimeline', type, options, p, withBubble)
    setLoading()
    const myAccount = await ensureClient()
    if (p === null) {
      p = myAccount?.accountId
    }
    console.log('getTimeline', type, options, p, withBubble)
    try {
      let res = []
      let account = null
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
          res = await client.value.getAccountStatuses(p, options)
          account = await getAccount(p, withBubble)
          res = await client.value.getAccountStatuses(p, options)
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
          console.log('tags', p)
          if (p) {
            res = await client.value.getTagTimeline(p, options)
          }
          break
      }
      setLoading()
      return Promise.resolve({
        statuses: res?.data || [],
        account: account
      })
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
    setLoading(true)
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

  const generateClient = async (account) => {
    try {
      client.value = generator(account.sns, account.baseUrl, account.accessToken, 'enclosure')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const ensureClient = async (account = null) => {
    const store = useStore()
    if (!account) {
      account = await store.ensureAccount()
    }
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

  const enrichDbAccount = async (id) => {
    await ensureClient()
    try {
      const follower = await client.value.getAccountFollowers(id, { limit: 100 })
      const following = await client.value.getAccountFollowing(id, { limit: 100 })

      console.log(following)

      const instance = await client.value.getInstance()

      const result = {}

      result.follower = follower.data.map(item => item.id)
      result.following = following.data.map(item => item.id)
      result.instance = instance.data

      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getAccountFollowing = async (id, options) => {
    await ensureClient()
    try {
      const following = await client.value.getAccountFollowing(id)
      return Promise.resolve(following.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getAccountFollower = async (id, options) => {
    await ensureClient()
    try {
      const follower = await client.value.getAccountFollowers(id)
      return Promise.resolve(follower.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getAccount = async (id, withBubble = false) => {
    const myAccount = await ensureClient()
    try {
      const account = await client.value.getAccount(id)
      const result = account.data
      if (withBubble) {
        const followers = await client.value.getAccountFollowers(id)
        const following = await client.value.getAccountFollowing(id)
        result.follower = followers.data
        result.following = following.data
      }
      result.isFollowedByMe = myAccount.following.includes(account.data.id)
      result.isFollowing = myAccount.follower.includes(account.data.id)
      result.isMe = account.data.id === myAccount.accountId
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const fetchAccessToken = async (domain, clientId, clientSecret, code, redirect, sns, baseUrl) => {
    setDomain(domain)

    if (!sns.value) await detectSns()
    const fClient = generator(sns, baseUrl)

    try {
      const res = await fClient.fetchAccessToken(clientId, clientSecret, code, redirect)
      accessToken.value = res.access_token
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

  const registerApp = async (domain, id) => {
    setDomain(domain)
    if (!sns.value) await detectSns()

    const fClient = generator(sns.value, baseUrl.value)
    const redirectRoute = redirect + '/' + id

    try {
      const res = await fClient.registerApp(appName, {
        website: appUrl,
        redirect_uris: redirectRoute,
        scopes: scopes
      })
      res.redirect = redirectRoute
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
    enrichDbAccount,
    favouriteStatus,
    fetchAccessToken,
    getAccount,
    getAccountFollower,
    getAccountFollowing,
    getAccountStatuses,
    getBookmarks,
    getFavourites,
    getInstanceTrends,
    getNotifications,
    getRoute,
    getSuggestions,
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
