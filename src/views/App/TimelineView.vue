<template>
  <enclosure-container>
    <template #default>
      <enclosure-timeline
        :type="timelineType"
      />
    </template>
    <template #aside>
      <enclosure-trends />
      <enclosure-suggestions />
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToots } from '@/stores/toots'
import { useStore } from '@/stores/global'
import { useProp } from '@/composables/useProp.js'

import PouchDb from '@/models/lib/PouchDb'
import Account from '@/models/Account'

const store = useToots()
const route = useRoute()
const global = useStore()

defineProps({
  title: useProp(String, 'Timeline ohne Name')
})

watch(route, async (route) => {
  console.log(route?.params?.tag)
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, null, route?.params?.tag || null)
}, { immediate: true })

const timelineType = computed(() => route?.params?.type || 'home')

onMounted(async () => {
  const db = new PouchDb()
  // const info = await db.info()
  // console.log(info)

  const account = await Account.db().findAll()
  console.log(account)
})

</script>
