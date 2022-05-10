<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3 ml-3 overflow-y-auto text-center">
      <span class="text-lg text-gray-600 font-bold">
        Die Woche
      </span>
      <div class="text-sm text-gray-500">
        auf {{ store.instance }}
      </div>
    </div>
    <div class="mx-3 space-y-2">
      <enclosure-trends-tag
        v-for="(trend, index) in trends"
        :key="index"
        :trend="trend"
      />
    </div>
  </ul>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores/global'

const store = useStore()
const trends = ref([])

</script>
