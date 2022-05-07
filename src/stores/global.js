import { acceptHMRUpdate, defineStore } from 'pinia'
import Account from '@/models/Account'
import DeepL from '@/utils/DeepL'

import { useTemplateFilter } from '@/composables/useTemplateFilter'
const { formatInt } = useTemplateFilter()

export const useStore = defineStore({
  id: 'global',
  state: () => ({
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
        return Promise.resolve(this.account)
      }
      const id = this.getAccountId()
      if (id) {
        const account = await Account.db().get(id)
        if (account) {
          this.setAccount(account)
        }
        return Promise.resolve(account)
      }
      return Promise.reject(new Error('Keinen Account gefunden'))
    },
    getAccount () {
      return this.account
    },
    setAccountId (accountId) {
      localStorage.setItem('current-account-id', accountId)
      this.accountId = accountId
      return accountId
    },
    setIsLoading (value) {
      this.isLoadingStatus = value
    },
    getAccountId () {
      return localStorage.getItem('current-account-id')
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
      if (account === null) {
        this.setAccountId(null)
      } else {
        this.setAccountId(account.id)
      }
    },
    genEnvVar (key) {
      return import.meta.env[key]
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
