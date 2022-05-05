<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-deepl-box
      :toot="toot"
    />
    <div
      v-if="toot.content"
      class="leading-normal text-gray-900 toot-content overflow-x-hidden"
      v-html="toot.content"
    />
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  toot: useProp(Object)
})

</script>
