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
import generator, { detector } from 'megalodon'
import { LowSync, LocalStorage } from 'lowdb'

const db = new LowSync(new LocalStorage('enclosureAccounts'))

db.read()
db.data ||= { accounts: [] }

onMounted(async () => {

})

const confirm = async () => {
  console.log(form.value.domainName)
  const protocol = 'https'
  const appName = 'enclosure'
  const appUrl = 'https://github.com/dspangenberg/enclosure'
  const domain = form.value.domainName.trim()
  const sns = await detector(`https://${domain}`)
  const baseUrl = `${protocol}://${domain}`
  const client = generator(sns, baseUrl, null, 'enclosure')
  console.log(client)
  console.log(sns)

  const res = await client.registerApp(appName, {
    website: appUrl,
    redirect_uris: 'http://localhost:3000/auth/autorize',
    scopes: ['read', 'write', 'follow', 'push']
  })

  const { clientId, clientSecret, session_token: sessionToken, url } = res
  console.log(clientId, clientSecret, sessionToken, url)

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

  account.sns = sns
  account.baseURL = baseUrl
  account.domain = domain
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
