<template>
  <div class="mt-2 text-base text-gray-700">
    <p
      class="leading-snug text-gay-900 toot-content font-medium px-0.5"
      v-html="content"
    />
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  content: useProp(String)
})
</script>
