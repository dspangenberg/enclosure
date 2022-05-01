<template>
  <enclosure-timeline
    :timeline="timeline"
    label="Lesezeichen"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMegalodon } from '@/composables/useMegalodon.js'

const { getBookmarks } = useMegalodon()
const timeline = ref(null)

onMounted(async () => {
  timeline.value = await getBookmarks()
})
</script>
