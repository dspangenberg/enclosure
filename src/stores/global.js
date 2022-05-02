import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { useCookies } from '@vueuse/integrations/useCookies'
import { accountById, firstAccount } from '@/utils/db.js'

const { verifyAccountCredentials } = useMegalodon()
const { get, set } = useCookies(['enclusure'], { doNotParse: false, autoUpdateDependencies: false })

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    client: null,
    account: null,
    accountId: null,
    isLoadingStatus: false
  }),
  getters: {
    getMastodonHandle: (state) => state.user ? `@${state.account.username}@${state.account.domain}` : '',
    isLoading: (state) => state.isLoadingStatus
  },
  actions: {
    ensureAccount () {
      if (this.account) {
        return this.account
      }
      const account = accountById(this.getAccountId())
      if (!account) {
        this.account = firstAccount()
      }
      return this.account
    },
    async reconnect () {
      try {
        await verifyAccountCredentials()
        return Promise.resolve(this.account)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    getAccount () {
      return this.account
    },
    setAccountId (accountId) {
      set('accountId', accountId, { path: '/' })
    },
    setIsLoading (value) {
      this.isLoadingStatus = value
    },
    getAccountId () {
      return get('accountId')
    },
    setClient (client) {
      this.client = client
    },
    setAccount (account) {
      this.account = account
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
