<template>
  <div class="my-2">
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
  if (props.toot.card.type && props.toot.card.url.includes('twitter')) {
    if (props.toot.card.height === props.toot.card.width) {
      console.log('twitter')
      return 'enclosure-toot-content-card-simple-tweet'
    }
  }

  switch (props.toot.card.type) {
    case 'link':
    default:
      return 'enclosure-toot-content-card-link'
  }
})
</script>
