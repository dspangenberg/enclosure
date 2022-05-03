<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3 ml-3 overflow-y-auto text-center">
      <span class="text-lg text-gray-600 font-bold">
        Wem folgen?
      </span>
      <div class="mx-auto">
        <div class="space-x-2 flex mt-2">
          <enclosure-suggestions-account
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :suggestion="suggestion"
          />
        </div>
      </div>
    </div>
  </ul>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMegalodon } from '@/composables/useMegalodon.js'
import { sortBy, reverse, sumBy } from 'lodash'

const { getSuggestions } = useMegalodon()

const suggestions = ref(null)

onMounted(async () => {
  const items = await getSuggestions(20)
  const item1 = items[Math.floor(Math.random() * items.length)]
  const item2 = items[Math.floor(Math.random() * items.length)]
  const item3 = items[Math.floor(Math.random() * items.length)]
  const item4 = items[Math.floor(Math.random() * items.length)]
  const item5 = items[Math.floor(Math.random() * items.length)]
  const itemsa = reverse(sortBy([item1, item2, item3, item4, item5], 'username'))
  suggestions.value = itemsa

  console.log(reverse(sortBy(suggestions.value, 'username')))
})
</script>
