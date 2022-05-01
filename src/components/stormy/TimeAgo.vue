<template>
  <div>{{ value }}</div>
</template>

<script setup>
import { useProp } from '@/composables/useProp.js'

import { ref, watch } from 'vue'
import { useTimestamp } from '@vueuse/core'
import { DateTime } from 'luxon'
const { timestamp } = useTimestamp({ controls: true, interval: 10000 })

const value = ref('')

watch(timestamp, (newValue, oldValue) => {
  value.value = DateTime.fromISO(props.date).toRelative({ string: 'narrow', round: true })
}, {
  immediate: true
})

const props = defineProps({
  date: useProp(String)
})
</script>
