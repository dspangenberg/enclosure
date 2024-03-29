import { acceptHMRUpdate, defineStore } from 'pinia'
import { mastoApi } from '@/api'
import { useStore } from '@/stores/global'
import { useMastodon } from '@/composables/useMastodon'
const { getTimeline, getThread, statusAction, translate } = useMastodon()

export const useToots = defineStore({
  id: 'toots',
  state: () => ({
    toots: [],
    account: null,
    toot: {},
    list: null,
    thread: null,
    newTootsHome: [],
    timeline: null,
    loadingStatus: false,
    loadMoreQuery: {},
    loadingMore: false
  }),
  getters: {
    isLoading: (state) => state.loadingStatus,
    isLoadingMore: (state) => state.loadingMore,
    getToots: (state) => state.toots,
    lastToot: (state) => state.toots.pop(),
    newTootsHomeCounter: (state) => state.newTootsHome.length
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
      const s = useToots()
      s.$patch((state) => {
        state.toots = this.toots
        state.hasChanged = true
      })
    },
    updateThread (toot) {
      const index = this.thread.findIndex(item => parseInt(item.id) === parseInt(toot.id) || parseInt(item.reblog?.id) === parseInt(toot.id))
      if (index > -1) {
        this.thread[index] = toot
      }
    },
    async getThread (id) {
      this.loadingStatus = true
      this.thread = await getThread(id)
      this.loadingStatus = false
    },
    setToot (id) {
      this.toot = this.toots.find(item => item.id === id)
    },
    translatze (id) {
      this.toot = this.toots.find(item => item.id === id)
    },
    byId (id) {
      return this.toots.find(item => parseInt(item.id) === parseInt(id) || parseInt(item.reblog?.id) === parseInt(id))
    },
    threadById (id) {
      return this.thread.find(item => parseInt(item.id) === parseInt(id) || parseInt(item.reblog?.id) === parseInt(id))
    },
    tootOverSocket (toot) {
      console.log('tootOverSocket', this.timeline, toot)
      this.newTootsHome.unshift(toot)
    },
    async getTootsforTimeline (timeline = 'home', options = {}, p, withBubble = false) {
      this.thread = null
      this.timeline = timeline
      this.newToots = []
      options.limit = 20
      this.toots = []
      this.loadingStatus = true
      if (timeline === 'home') {
        this.newTootsHome = []
      }
      try {
        const payload = await getTimeline(timeline, p, options)
        this.loadMoreQuery = payload.next
        this.toots = payload.data
        this.account = payload.account
        this.list = payload.list
      } catch (error) {
        Promise.reject(error)
      }
      this.loadingStatus = false
    },
    async loadMore (timeline = 'home', options = {}, p = null, withBubble = false) {
      if (this.loadMoreQuery) {
        try {
          const payload = await getTimeline(timeline, p, this.loadMoreQuery)
          this.loadMoreQuery = payload.next
          this.toots.push(...payload.data)
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    shiftToots () {
      this.toots.unshift(...this.newTootsHome)
      this.newTootsHome = []
    },
    async action (action, id) {
      const toot = this.thread?.length ? this.threadById(id) : this.byId(id)
      const update = await statusAction(toot, action)
      this.thread?.length ? this.updateThread(update) : this.update(update)
    },
    async favorite (id) {
      await this.action('favourite', id)
    },
    async bookmark (id) {
      await this.action('bookmark', id)
    },
    async translate (toot) {
      const id = toot.reblog?.id ? toot.reblog.id : toot.id

      // const toot = this.thread?.length ? this.threadById(id) : this.byId(id)
      const update = Object.assign({}, toot)
      update.translation = await translate(id)
      this.thread?.length ? this.updateThread(update) : this.update(update)
    },
    async reblog (id) {
      await this.action('reblog', id)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToots, import.meta.hot))
}
