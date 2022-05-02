<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3 ml-3 overflow-y-auto">
      <span class="text-lg text-gray-600 font-bold">
        Trends
      </span>
      <div class="text-sm text-gray-500">
        {{ store.instance }}
      </div>
    </div>
    <div class="mx-3 space-y-2 divide-y">
      <trends-tag
        v-for="(trend, index) in limitetedTrends"
        :key="index"
        :trend="trend"
      />
    </div>
  </ul>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMegalodon } from '@/composables/useMegalodon.js'
import TrendsTag from './TrendsTag.vue'
import { useStore } from '@/stores/global'
import { sortBy, reverse } from 'lodash'

const store = useStore()

const { getInstanceTrends } = useMegalodon()

const trends = ref(null)
const isLimited = ref(true)

const limitetedTrends = computed(() => trends.value && isLimited.value ? trends.value.slice(0, 10) : trends.value)

onMounted(async () => {
  let items = await getInstanceTrends(20)
  items = items.map(item => { return { name: item.name, uses: parseInt(item.history[0].uses) } })
  console.log(items)
  const sorted = reverse(sortBy(items, ['uses']))
  trends.value = sorted
})
</script>
