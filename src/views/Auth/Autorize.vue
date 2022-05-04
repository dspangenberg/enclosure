<template>
  <div class="flex flex-col">
    <div
      v-if="error"
      class="mb-6"
    >
      <stormy-error
        :title="error"
      >
        {{ errorDescription }}
      </stormy-error>
    </div>
    <div
      v-if="errorObj"
    >
      <stormy-http-error :error="errorObj" />
    </div>
    <a
      class="text-center w-full flex-1 font-semibold pr-3 text-sm text-red-600 hover:underline"
      href="/auth/login"
    >
      Zurück zum Login
    </a>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { useRouter } from 'vue-router'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { useStore } from '@/stores/global'
import { accountById, upsertAccount } from '@/utils/db.js'
import { useCookies } from '@vueuse/integrations/useCookies'

const { get, remove } = useCookies(['enclusure'], { doNotParse: false, autoUpdateDependencies: false })

const store = useStore()
const router = useRouter()

const code = useRouteQuery('code')
const error = useRouteQuery('error')
const errorDescription = useRouteQuery('error_description')

const errorObj = ref(null)

onMounted(async () => {
  const { fetchAccessToken, verifyAccountCredentials, client } = await useMegalodon()

  const accoutId = get('accountId')
  remove('accountId')

  const account = accountById(accoutId)

  let token = null
  let acc = null

  if (code?.value) {
    try {
      token = await fetchAccessToken(code.value)
      acc = await verifyAccountCredentials()
      account.username = acc.username
      account.accountId = acc.id
      account.avatar = acc.avatar
      account.url = acc.url
      account.acct = acc.acct
      account.accessToken = token.accessToken
      account.refreshToken = token.refreshToken || ''


      const updatedAccount = upsertAccount(account)

      store.setAccountId(updatedAccount.id)
      store.setClient(client)
    } catch (error) {
      errorObj.value = error.response
      return Promise.reject(error)
    }
    router.push('/app/timeline/home')
  }
})

</script>
