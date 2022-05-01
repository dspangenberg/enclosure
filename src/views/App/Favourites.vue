<template>
  <enclosure-timeline
    :timeline="timeline"
    label="Favoriten"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMegalodon } from '@/composables/useMegalodon.js'

const { getFavourites } = useMegalodon()
const timeline = ref(null)

onMounted(async () => {
  timeline.value = await getFavourites()
})
</script>
