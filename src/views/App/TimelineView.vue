<template>
  <enclosure-timeline
    :type="timelineType"
  />
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
  await store.getTootsforTimeline(route?.params?.type || 'home')
}, { immediate: true })

const timelineType = computed(() => route?.params?.type || 'home')

</script>
