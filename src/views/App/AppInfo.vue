<template>
  <enclosure-container
    :is-loading="isLoading"
    title="Systeminformationen + Debugging"
  >
    <template #title-right>
      <stormy-icon-button
        icon="database-off"
        variant="ghost"
        @click="pouchDbTruncate"
      />
    </template>
    <template #default>
      <div class="justify-start flex-1 flex-col items-start bg-gray-50">
        <div>
          <pre>{{ accounts }}</pre>
        </div>
      </div>
    </template>
    <template #aside>
      !
    </template>
  </enclosure-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Account from '@/models/Account'
import PouchDb from '@/models/lib/PouchDb'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const accounts = ref([])

const pouchDbTruncate = async () => {
  await PouchDb.db().truncate()
  await Account.revokeAccessToken()
  router.push('/')
}

onMounted(async () => {
  isLoading.value = true
  accounts.value = await Account.db().find()
  isLoading.value = false
})

</script>
