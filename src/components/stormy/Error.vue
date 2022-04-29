<template>
  <div
    v-if="title"
    class="rounded-md bg-red-50 p-4 border border-red-200"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <stormy-icon
          name="alert-circle"
          class="text-red-800 h-7 w-7 drop-shadow-lg mx-auto"
        />
      </div>
      <div class="ml-3 mt-1">
        <h3 class="text-large font-semibold text-red-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-red-700 leading-snug">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  title: useProp(String)
})

</script>
