<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3  overflow-y-auto text-center">
      <div class=" flex items-center flex-col ">
        <span class="group text-lg text-gray-600 font-bold text-center  group select-none">
          <div class="flex items-center group cursor-pointer">
            <span>Bubblevorschläge</span>
            <span class="group">
              <stormy-icon
                name="refresh"
                class="w-4 h-4 text-transparent group-hover:text-gray-500 hover:text-blue-500 cursor-pointer ml-0.5"
                @click="store.getSuggestions"
              />
            </span>
          </div>
        </span>
      </div>
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
