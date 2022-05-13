import { acceptHMRUpdate, defineStore } from 'pinia'
import Account from '@/models/Account'
import DeepL from '@/utils/DeepL'
import { useMastodon } from '@/composables/useMastodon'

import { useTemplateFilter } from '@/composables/useTemplateFilter'
const { formatInt } = useTemplateFilter()

const { getSuggestions, removeSuggestion } = useMastodon()

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    account: null,
    accountId: null,
    isLoadingStatus: false,
    deepLimit: null,
    $connection: null,
    suggestions: []
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
        console.log(account)
        if (account) {
          this.setAccount(account)
        }
        return Promise.resolve(account)
      }
      console.log('****')
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
    getMastodonId () {
      return sessionStorage.getItem('mastodonId')
    },
    async getAccessToken () {
      const account = await this.ensureAccount()
      if (account) {
        return account.accessToken
      } else {
        return null
      }
    },
    connect () {
      return {
        url: sessionStorage.getItem('baseUrl'),
        token: sessionStorage.getItem('token')
      }
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
      sessionStorage.setItem('baseUrl', account.baseUrl)
      sessionStorage.setItem('token', account.accessToken)
      sessionStorage.setItem('mastodonId', account.mastodonId)
      if (account === null) {
        this.setAccountId(null)
      } else {
        this.setAccountId(account.id)
      }
    },
    async getSuggestions (limit) {
      this.suggestions = await getSuggestions(limit = 5)
    },
    async removeSuggestion (id) {
      const suggestion = await removeSuggestion(id)
      suggestion.blink = true
      const index = this.suggestions.findIndex(item => item.id === id)
      this.suggestions[index] = suggestion
    },
    genEnvVar (key) {
      return import.meta.env[`VITE_APP_${key}`]
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
