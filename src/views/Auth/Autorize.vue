<template>
  Lv6HuenEdlNPUist2woVaBaxCuansPVn5ln2pXUegJo
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { LowSync, LocalStorage } from 'lowdb'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/global'
import { useMegalodon } from '@/composables/useMegalodon.js'

const store = useStore()

const router = useRouter()
const db = new LowSync(new LocalStorage('enclosureAccounts'))

db.read()
db.data ||= { accounts: [] }

const code = useRouteQuery('code')

onMounted(async () => {
  const { fetchAccessToken, verifyAccountCredentials, client } = await useMegalodon()

  const account = db.data.accounts[0]

  const data = await fetchAccessToken(code.value, account)
  const res = await verifyAccountCredentials()

  db.data.accounts[0].username = res.data.username
  db.data.accounts[0].accountId = res.data.id
  db.data.accounts[0].avatar = res.data.avatar
  db.data.accounts[0].accessToken = data.accessToken
  db.data.accounts[0].refreshToken = data.refreshToken
  db.data.accounts[0].url = res.data.url
  db.write()

  store.setClient(client)
  store.setUser(db.data.accounts[0])

  router.push('/app/home')
})

</script>
