<template>
  <div>{{ value }}</div>
</template>

<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed } from 'vue'

const { formatRelDate } = useTemplateFilter()

const props = defineProps({
  date: useProp(String)
})

const value = computed(() => formatRelDate(props.date))

</script>
