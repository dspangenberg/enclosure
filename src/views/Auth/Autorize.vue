<template>
  Lv6HuenEdlNPUist2woVaBaxCuansPVn5ln2pXUegJo
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import generator from 'megalodon'
import { LowSync, LocalStorage } from 'lowdb'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = new LowSync(new LocalStorage('enclosureAccounts'))

db.read()
db.data ||= { accounts: [] }

const code = useRouteQuery('code')

onMounted(async () => {
  const account = db.data.accounts[0]
  console.log(account)
  let client = generator(account.sns, account.baseURL, null, 'enclosure')
  console.log(client, code.value)
  const data = await client.fetchAccessToken(account.clientId, account.clientSecret, code.value, 'http://localhost:3000/auth/autorize')
  console.log(data)

  client = generator(account.sns, account.baseURL, data.accessToken, 'enclosure')
  const res = await client.verifyAccountCredentials()
  console.log(res)

  db.data.accounts[0].username = res.data.username
  db.data.accounts[0].accountId = res.data.id
  db.data.accounts[0].avatar = res.data.avatar
  db.data.accounts[0].accessToken = data.accessToken
  db.data.accounts[0].refreshToken = data.refreshToken
  db.data.accounts[0].url = res.data.url
  db.write()
  router.push('/app/home')
})

</script>
