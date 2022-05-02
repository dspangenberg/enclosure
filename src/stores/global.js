import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { useCookies } from '@vueuse/integrations/useCookies'
import { accountById, firstAccount } from '@/utils/db.js'
import { useStorage } from '@vueuse/core'

const { verifyAccountCredentials } = useMegalodon()

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
      useStorage('current-account-id', accountId)
    },
    setIsLoading (value) {
      this.isLoadingStatus = value
    },
    getAccountId () {
      return useStorage('current-account-id')
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
