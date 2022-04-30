<template>
  <div class="overflow-hidden max-w-2xl mx-auto h-auto z-10 w-full flex flex-col">
    <div class="pb-5">
      <div class=" text-lg font-bold text-gray-900 flex items-center">
        <div class="flex-1 h-full my-3">
          {{ label }}
        </div>
      </div>
    </div>
    <div class="overflow-y-auto flex-1">
      <ul
        role="list"
        class="space-y-2"
      >
        <enclosure-toot
          v-for="toot in timeline"
          :key="toot.id"
          :toot="toot"
        />
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  timeline: useProp(Array),
  label: useProp(String, '')
})

</script>
