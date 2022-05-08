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
import { useRouter, useRoute } from 'vue-router'
import Account from '@/models/Account'

const router = useRouter()
const route = useRoute()

const code = useRouteQuery('code')
const error = useRouteQuery('error')
const errorDescription = useRouteQuery('error_description')

const errorObj = ref(null)

onMounted(async () => {
  const accountId = route.params.id
  if (accountId && code.value) {
    try {
      await Account.autorize(accountId, code.value)
      router.push('/app/timeline/home')
    } catch (error) {
      errorObj.value = error.response
      return Promise.reject(error)
    }
  }
})

</script>
