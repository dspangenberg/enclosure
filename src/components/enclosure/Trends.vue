<template>
  <ul class="w-64">
    <div class=" mt-12 mb-3 ml-3 overflow-y-auto text-center">
      <span class="text-lg text-gray-600 font-bold">
        Trends
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
import { ref, onMounted, computed } from 'vue'
import { useMastodon } from '@/composables/useMastodon'
import { useStore } from '@/stores/global'

const { getTrends } = useMastodon()

const store = useStore()
const trends = ref([])
const isLimited = ref(true)

const limitetedTrends = computed(() => trends.value && isLimited.value ? trends.value.slice(0, 10) : trends.value)

onMounted(async () => {
  trends.value = await getTrends()
})

</script>
