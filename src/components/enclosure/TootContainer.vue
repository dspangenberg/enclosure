<template>
  <div>
    <div
      class="my-2.5 mx-4 space-y-3 space-x-4"
      :class="innerClass"
    >
      <slot />
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  innerClass: useProp(String)
})
</script>
