<template>
  <div class="flex items-center mr-3 mt-1.5">
    <div class="relative">
      <img
        class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
        :src="account.avatar"
        alt=""
      >
      <span
        v-if="otherAccount"
        class="absolute -bottom-0.5 -right-1  px-0.5 py-px"
      >
        <img
          class="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
          :src="otherAccount.avatar"
          alt=""
        >
      </span>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  account: useProp(Object),
  otherAccount: useProp(Object)
})
</script>
