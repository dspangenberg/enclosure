<template>
  <li class="text-base pt-2">
    <router-link
      :to="route(suggestion)"
    >
      <img
        class="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200 p-[1px] cursor-pointer"
        :class="suggestion.blink === true ? 'animate-bounce temporary-bounce' : ''"
        :src="suggestion.avatar"
        alt=""
      >
    </router-link>
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  suggestion: useProp(Object)
})

const route = (account) => {
  return `/app/timeline/profile/${account.id}?suggestion=true`
}
</script>
