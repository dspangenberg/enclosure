<template>
  <li class="text-base pt-2 flex items-center">
    <router-link
      :to="href"
      class="font-semibold text-blue-600 flex-1 truncate"
    >
      #{{ trend.name }}
    </router-link>
    <span class="text-xs text-gray-500 mr-0.5">
      {{ trend.uses }}
    </span>
    <stormy-icon
      name="users"
      class="w-3 h-3 text-gray-400"
    />
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  trend: useProp(Object)
})

const href = computed(() => `/app/timeline/tags/${props.trend.name}`)

</script>
