<template>
  <svg
    :class="$attrs.class"
    aria-hidden="true"
  >
    <use
      :xlink:href="symbolId"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'

const props = defineProps({
  prefix: useProp(String, 'icon'),
  strokeWidth: useProp(Number, 1.5),
  fill: useProp(Boolean, false),
  name: useProp(String, '', true)
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

</script>
