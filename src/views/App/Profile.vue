<template>
  <enclosure-timeline
    :timeline="timeline"
    label="Profil"
  />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMegalodon } from '@/composables/useMegalodon.js'

const { getAccountStatuses } = useMegalodon()
const timeline = ref(null)

onMounted(async () => {
  timeline.value = await getAccountStatuses()
})
</script>
