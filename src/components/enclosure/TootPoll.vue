<template>
  <div class="my-2">
    <enclosure-toot-poll-option-radios :options="toot.poll.options" />
    <button
      ref="cancelButtonRef"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
    >
      Abstimmen
    </button>
  </div>
</template>
<script setup>

import { useProp } from '@/composables/useProp.js'
defineProps({
  toot: useProp(Object)
})
</script>
