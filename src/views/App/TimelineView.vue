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
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToots } from '@/stores/toots'
import { useProp } from '@/composables/useProp.js'

const store = useToots()
const route = useRoute()

defineProps({
  title: useProp(String, 'Timeline ohne Name')
})

watch(route, async (route) => {
  console.log(route?.params?.tag)
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, null, route?.params?.tag || null)
}, { immediate: true })

const timelineType = computed(() => route?.params?.type || 'home')

</script>
