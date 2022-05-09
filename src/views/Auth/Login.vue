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
import { ref } from 'vue'
import Account from '@/models/Account'

const errorObj = ref(null)
const networkError = ref('')

const confirm = async () => {
  try {
    const { url } = await Account.registerApp(form.value.domainName)
    console.log(url)
    window.location = url
  } catch (error) {
    console.log(error)
    if (Object.prototype.hasOwnProperty.call(error, 'docId')) {
      console.log('PouchDb-Fehler', error)
      return Promise.reject(error)
    }
    if (error.response) {
      errorObj.value = error.response
    } else {
      const json = error.toJSON()
      if (json.message === 'Network Error') {
        networkError.value = true
      }
    }
    Promise.reject(error)
  }
}

const form = ref({
  domainName: 'mastodon.social'
})

</script>
