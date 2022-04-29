<template>
  <label class="block font-medium text-sm text-gray-700 mb-1">
    <slot>{{ label }}</slot>
  </label>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  label: useProp(String)
})

</script>
