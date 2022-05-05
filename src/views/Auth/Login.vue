<template>
  <div>
    <div
      v-if="networkError"
      class="mb-6"
    >
      <stormy-error
        title="Netzwerkfehler"
      >
        Es konnte keine Verbindung zum angegebenen Server hergestellt werden.
      </stormy-error>
    </div>
  </div>
  <div
    v-if="errorObj"
    class="flex flex-col"
  >
    <stormy-http-error :error="errorObj" />
  </div>
  <div class="space-y-2 max-w-xs mx-auto">
    <div>
      <stormy-input
        v-model="form.domainName"
        autofocus
        label="Domainname:"
      />
    </div>
    <button
      type="confirm"
      class="w-full flex justify-center shadow-sm font-semibold text-sm px-2 py-2 border border-transparent rounded relative text-white bg-blue-600 hover:bg-blue-500  focus:border-white focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-blue-700"
      @click="confirm"
    >
      Weiter
    </button>
  </div>
</template>
<script setup>
import { useMegalodon } from '@/composables/useMegalodon.js'
import { ref } from 'vue'
import { upsertAccount, firstAccount } from '@/utils/db.js'
import { useStore } from '@/stores/global'
import { useCookies } from '@vueuse/integrations/useCookies'

import Account from '@/models/Account'

const { set } = useCookies(['enclusure'], { doNotParse: false, autoUpdateDependencies: false })

const store = useStore()
const errorObj = ref(null)
const networkError = ref('')

const { registerApp, sns, baseUrl, domain } = useMegalodon()

const confirm = async () => {
  let mastdonServerUrl = null

  try {
    const data = await registerApp(form.value.domainName)
    const { clientId, clientSecret, url } = data
    mastdonServerUrl = url

    // const account = firstAccount() || {}
    const account = await Account.db().first()

    account.sns = sns.value
    account.baseUrl = baseUrl.value
    account.domain = domain.value
    account.sns = sns.value
    account.clientId = clientId
    account.clientSecret = clientSecret

    const createdAccount = upsertAccount(account)

    set('accountId', createdAccount.id, { path: '/' })
  } catch (error) {
    if (error.response) {
      // errorObj.value = error.response
    } else {
      const json = error.toJSON()
      if (json.message === 'Network Error') {
        networkError.value = true
      }
    }
    Promise.reject(error)
  }

  if (mastdonServerUrl) {
    window.location = mastdonServerUrl
  }
}

const form = ref({
  domainName: 'mastodon.social'
})

</script>
