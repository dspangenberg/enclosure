import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import Account from '@/models/Account'
import DeepL from '@/utils/DeepL'

import { useTemplateFilter } from '@/composables/useTemplateFilter'
const { formatInt } = useTemplateFilter()

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    client: null,
    account: null,
    accountId: null,
    isLoadingStatus: false,
    deepLimit: null
  }),
  getters: {
    getMastodonHandle: (state) => state.account ? `@${state.account.username}@${state.account.domain}` : '',
    isLoading: (state) => state.isLoadingStatus,
    instance: (state) => state.account?.domain || ''
  },
  actions: {
    async ensureAccount () {
      if (this.account) {
        return this.account
      }
      const id = this.getAccountId()
      const account = await Account.db().get(id)
      if (account) {
        this.setAccount(account)
      }
      return this.account
    },
    async reconnect () {
      if (this.client) {
        return this.client
      }
      try {
        const globAccount = await this.ensureAccount()
        if (globAccount) {
          await Account.verifyAccountCredentials(globAccount)
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('Keinen Account gefunden'))
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    getAccount () {
      return this.account
    },
    setAccountId (accountId) {
      useStorage('current-account-id', accountId)
      return useStorage('current-account-id')
    },
    setIsLoading (value) {
      this.isLoadingStatus = value
    },
    getAccountId () {
      const storage = useStorage('current-account-id')
      return storage ? storage.value : null
    },
    setClient (client) {
      this.client = client
    },
    async getClient () {
      if (this.client) {
        return this.client
      }
    },
    async getDeepLimit () {
      if (!this.deepLimit) {
        await DeepL.usage()
      }
      return formatInt(this.deepLimit)
    },
    setDeepLimit (value) {
      this.deepLimit = value
    },
    setAccount (account) {
      this.account = account
      this.setAccountId(account.id)
    },
    genEnvVar (key) {
      return import.meta.env[key]
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
