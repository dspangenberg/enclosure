<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3  overflow-y-auto text-center">
      <span class="text-lg text-gray-600 font-bold">
        Mehr Bubbles
      </span>
      <div class="mx-auto ml-3">
        <div class="space-x-2 flex mt-2">
          <enclosure-suggestions-account
            v-for="(suggestion, index) in store.suggestions"
            :key="index"
            :suggestion="suggestion"
          />
        </div>
      </div>
    </div>
  </ul>
</template>
<script setup>
import { onMounted } from 'vue'
import { useStore } from '@/stores/global'

const store = useStore()

onMounted(async () => {
  await store.getSuggestions()
})
</script>
