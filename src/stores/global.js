import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { useCookies } from '@vueuse/integrations/useCookies'
import { accountById } from '@/utils/db.js'

const { verifyAccountCredentials } = useMegalodon()
const { get, set } = useCookies(['enclusure'], { doNotParse: false, autoUpdateDependencies: false })

export const useStore = defineStore({
  id: 'global',
  state: () => ({
    client: null,
    account: null,
    accountId: null
  }),
  getters: {
    getMastodonHandle: (state) => state.user ? `@${state.account.username}@${state.account.domain}` : ''
  },
  actions: {
    async reconnect () {
      this.account = accountById(this.getAccountId())
      await verifyAccountCredentials(this.account)
    },
    getAccount () {
      return this.account
    },
    setAccountId (accountId) {
      set('accountId', accountId, { path: '/' })
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
