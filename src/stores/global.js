import { acceptHMRUpdate, defineStore } from 'pinia'
import Account from '@/models/Account'
import DeepL from '@/utils/DeepL'
import { mastoApi } from '@/api'

import { useTemplateFilter } from '@/composables/useTemplateFilter'
const { formatInt } = useTemplateFilter()

const { connect } = mastoApi()

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    account: null,
    accountId: null,
    isLoadingStatus: false,
    deepLimit: null,
    $connection: null
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
    async getMastodonId () {
      const account = await this.ensureAccount()
      if (account) {
        return account.accountId
      }
      return null
    },
    async getAccessToken () {
      const account = await this.ensureAccount()
      if (account) {
        return account.accessToken
      } else {
        return null
      }
    },
    async connect () {
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
      if (account === null) {
        this.setAccountId(null)
      } else {
        this.setAccountId(account.id)
      }
    },
    genEnvVar (key) {
      return import.meta.env[`VITE_APP_${key}`]
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
