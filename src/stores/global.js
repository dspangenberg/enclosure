import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    client: null,
    user: null
  }),
  getters: {
    getMastodonHandle: (state) => `@${state.user.username}@${state.user.domain}`
  },
  actions: {
    setClient (client) {
      console.log(client)
      this.client = client
    },
    setUser (user) {
      this.user = user
      console.log(user)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
