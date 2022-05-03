<template>
  <li class="text-base pt-2">
    <a
      :href="suggestion.url"
      target="_blank"
    >
      <img
        class="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200 p-[1px] cursor-pointer"
        :src="suggestion.avatar"
        alt=""
      >

    </a>
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  suggestion: useProp(Object)
})

const href = computed(() => `/app/timeline/tags/${props.trend.name}`)

</script>
