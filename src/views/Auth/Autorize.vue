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
import { useStore } from '@/stores/global'
import { useCookies } from '@vueuse/integrations/useCookies'
import Account from '@/models/Account'

const { get, remove } = useCookies(['enclusure'], { doNotParse: false, autoUpdateDependencies: false })

const store = useStore()
const router = useRouter()

const code = useRouteQuery('code')
const error = useRouteQuery('error')
const errorDescription = useRouteQuery('error_description')

const errorObj = ref(null)

onMounted(async () => {
  const accoutId = get('accountId')

  if (code?.value) {
    try {
      const account = await Account.autorize(accoutId, code.value)
      store.setAccount(account)
      remove('accountId')
      router.push('/app/timeline/home')
    } catch (error) {
      errorObj.value = error.response
      return Promise.reject(error)
    }
  }
})

</script>
