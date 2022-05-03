<template>
  <div class="flex items-center mr-3">
    <div class="relative mx-auto">
      <img
        class="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200 p-[1px] cursor-pointer"
        :src="account.avatar"
        alt=""
      >
      <span
        v-if="otherAccount"
        class="absolute bottom-5 right- px-0.5 py-px hidden"
      >
        <img
          class="h-5 w-5 rounded-full bg-white flex items-center justify-center border border-gray-50"
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
