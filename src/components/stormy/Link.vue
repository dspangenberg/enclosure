<template>
  <component
    :is="as"
    v-if="label"
  >
    <span
      v-if="prefix"
      class="mr-0.5"
      :class="prefixClass"
    >
      {{ prefix }}
    </span>
    <a
      v-if="link"
      :href="link"
      :target="target"
      :class="linkClass"
    >
      {{ label }}
    </a>
    <span v-else>
      {{ label }}
    </span>
  </component>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  label: useProp(String),
  link: useProp(String),
  target: useProp(String, '_blank'),
  as: useProp(String, 'span'),
  prefix: useProp(String, ''),
  linkClass: useProp(String, 'hover:underline'),
  prefixClass: useProp(String, '')
})

</script>
