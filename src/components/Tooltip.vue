<template>
  <!-- https://codesandbox.io/s/8e9k3?file=/src/components/Tooltip.vue -->
  <span
    class="font-sans bg-black/90"
    :tooltip="tooltipText"
    :position="position"
  ><slot /></span>
</template>

<script>
</script>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  tooltipText: useProp(String, 'Tooltip text'),
  position: useProp(String, 'top')
})
</script>
