<template>
  <div class="space-y-2">
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
import { ref, onMounted } from 'vue'
import { LowSync, LocalStorage } from 'lowdb'
import { useMegalodon } from '@/composables/useMegalodon.js'

const megalodon = ref()

onMounted(async () => {
  const { registerApp, sns, baseURL, domain } = await useMegalodon()
  megalodon.value = { registerApp, sns, baseURL, domain }
})

const db = new LowSync(new LocalStorage('enclosureAccounts'))
db.read()
db.data ||= { accounts: [] }

const confirm = async () => {
  const data = await megalodon.value.registerApp(form.value.domainName)

  const { clientId, clientSecret, url } = data
  const { accounts } = db.data
  const account = accounts[0] || {
    baseURL: null,
    domain: null,
    sns: null,
    clientId: null,
    clientSecret: null,
    accessToken: null,
    refreshToken: null,
    username: null,
    accountId: null,
    acct: null,
    url: null,
    avatar: null
  }

  account.sns = megalodon.value.sns
  account.baseURL = megalodon.value.baseURL
  account.domain = megalodon.value.domain
  account.clientId = clientId
  account.clientSecret = clientSecret

  accounts[0] = account
  db.write()

  window.location = url
}

const form = ref({
  domainName: 'mastodon.social'
})

</script>
