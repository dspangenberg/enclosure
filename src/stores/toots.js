import { acceptHMRUpdate, defineStore } from 'pinia'
import { mastoApi } from '@/api'
import { useStore } from '@/stores/global'

export const useToots = defineStore({
  id: 'toots',
  state: () => ({
    toots: [],
    account: null,
    toot: {},
    loadingStatus: false,
    loadingMore: false
  }),
  getters: {
    isLoading: (state) => state.loadingStatus,
    isLoadingMore: (state) => state.loadingMore,
    getToots: (state) => state.toots,
    lastToot: (state) => state.toots.pop()
  },
  actions: {
    async getApi () {
      const store = useStore()
      let acc = null
      try {
        acc = await store.ensureAccount()
      } catch (error) {
        return Promise.reject(error)
      }

      return mastoApi(acc.baseUrl + '/api/v1', acc.accessToken)
    },
    update (toot) {
      const index = this.toots.findIndex(item => parseInt(item.id) === parseInt(toot.id) || parseInt(item.reblog?.id) === parseInt(toot.id))
      if (index > -1) {
        this.toots[index] = toot
      }
    },
    setToot (id) {
      this.toot = this.toots.find(item => item.id === id)
    },
    byId (id) {
      return this.toots.find(item => parseInt(item.id) === parseInt(id) || parseInt(item.reblog?.id) === parseInt(id))
    },
    async getTootsFor (type, options, p, withBubble) {
      const {
        account,
        accountBookmarks,
        accountFavourites,
        accountFollowers,
        accountFollowing,
        accountStatuses,
        timelineConversations,
        timelineFederation,
        timelineHashtag,
        timelineHome,
        timelineList,
        timelineLocal
      } = await this.getApi()

      let res = []
      let acc = null

      const store = useStore()

      switch (type) {
        case 'home':
          res = await timelineHome(options)
          break
        case 'favorites':
          res = await accountFavourites(options)
          break
        case 'bookmarks':
          res = await accountBookmarks(options)
          break
        case 'profile':
          if (p === null) {
            p = await store.getMastodonId()
          }
          acc = await account(p)
          if (withBubble) {
            acc.followers = await accountFollowers()
            acc.following = await accountFollowing()
          }
          res = await accountStatuses(p, options)
          break
        case 'local':
          res = await timelineLocal(options)
          break
        case 'federation':
          res = await timelineFederation(options)
          break
        case 'conversations':
          res = await timelineConversations(options)
          break
        case 'tags':
          res = await timelineHashtag(p, options)
          break
        case 'list':
          res = await timelineList(p, options)
          break
      }
      return {
        account: acc,
        toots: res
      }
    },
    async getTootsforTimeline (timeline = 'home', options = {}, p, withBubble = false) {
      options.limit = 40
      this.toots = []
      this.loadingStatus = true
      try {
        const payload = await this.getTootsFor(timeline, options, p, withBubble)
        this.toots = payload.toots
        this.account = payload.account
      } catch (error) {
        Promise.reject(error)
      }
      this.loadingStatus = false
    },
    async loadMore (timeline = 'home', options = {}, p = null, withBubble = false) {
      if (!this.toots.length) return
      this.loadingMore = true
      options.max_id = this.toots.pop().id
      options.limit = 20
      const oldIds = this.toots.map(item => item.id)
      const payload = await this.getTootsFor(timeline, options, p, withBubble)
      for (const toot of payload.statuses) {
        if (!oldIds.includes(toot.id)) {
          this.toots.push(toot)
        }
      }
      this.loadingMore = false
    },
    async favorite (id) {
    },
    async bookmark (id) {
    },
    async reblog (id) {
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToots, import.meta.hot))
}
