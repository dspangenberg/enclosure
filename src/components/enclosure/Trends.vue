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
import { useStore } from '@/stores/global'
import { sortBy, reverse, sumBy } from 'lodash'

const store = useStore()

const { getInstanceTrends } = useMegalodon()

const trends = ref(null)
const isLimited = ref(true)

const limitetedTrends = computed(() => trends.value && isLimited.value ? trends.value.slice(0, 10) : trends.value)

onMounted(async () => {
  let items = await getInstanceTrends(20)
  console.log(items)

  items = items.map(item => {
    item.history = item.history.map(item => {
      item.accounts = parseInt(item.accounts)
      item.uses = parseInt(item.uses)
      return item
    })
    return item
  })
  items = items.map(item => { return { name: item.name, accounts: sumBy(item.history, 'accounts'), uses: sumBy(item.history, 'uses') } })
  trends.value = reverse(sortBy(items, ['uses']))
})
</script>
