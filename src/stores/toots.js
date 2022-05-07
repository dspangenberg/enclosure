import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { intersection } from 'lodash'

const {
  getTimeline,
  bookmarkStatus,
  favouriteStatus,
  reblogStatus,
  unbookmarkStatus,
  unfavouriteStatus,
  unreblogStatus
} = useMegalodon()

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
    async loadMore (timeline = 'home', options = {}, id = null, tag = null) {
      if (!this.toots.length) return
      this.loadingMore = true
      options.max_id = this.toots.pop().id
      options.limit = 20
      const oldIds = this.toots.map(item => item.id)
      const payload = await getTimeline(timeline, options, id, tag)
      for (const toot of payload.statuses) {
        if (!oldIds.includes(toot.id)) {
          this.toots.push(toot)
        }
      }
      this.loadingMore = false
    },
    async getTootsforTimeline (timeline = 'home', options = {}, id = null, tag = null) {
      options.limit = 40
      this.toots = []
      this.loadingStatus = true
      try {
        const payload = await getTimeline(timeline, options, id, tag)
        console.log(payload)
        this.toots = payload.statuses
        this.account = payload.account
      } catch (error) {
        Promise.reject(error)
      }
      this.loadingStatus = false
    },
    async favorite (id) {
      const toot = this.byId(id)
      if (toot) {
        try {
          const result = toot.favourited ? await unfavouriteStatus(id) : await favouriteStatus(id)
          this.update(result)
          return result
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    async bookmark (id) {
      const toot = this.byId(id)
      console.log('bookmark', id, toot)
      if (toot) {
        try {
          const result = toot.bookmarked ? await unbookmarkStatus(id) : await bookmarkStatus(id)
          this.update(result)
          return result
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    async reblog (id) {
      const toot = this.byId(id)
      if (toot) {
        try {
          console.log('reblog', toot)
          const result = toot.reblogged ? await unreblogStatus(id) : await reblogStatus(id)
          this.update(result)
          return result
        } catch (error) {
          Promise.reject(error)
        }
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToots, import.meta.hot))
}
