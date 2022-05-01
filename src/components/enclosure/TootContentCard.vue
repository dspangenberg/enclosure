<template>
  <div class="m-2">
    <component
      :is="getComponent"
      :card="toot.card"
    />
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
const props = defineProps({
  toot: useProp(Object)
})

const getComponent = computed(() => {
  switch (props.toot.card) {
    case 'link':
    default:
      return 'enclosure-toot-content-card-link'
  }
})
</script>
