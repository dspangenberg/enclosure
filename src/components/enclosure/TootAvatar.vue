<template>
  <div class="flex items-center mr-3">
    <div class="relative mx-auto">
      <router-link :to="route(account)">
        <img
          v-lazy="account.avatar"
          class="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200 p-[1px] cursor-pointer"
          alt=""
        >
        <span
          v-if="otherAccount"
          class="absolute bottom-5 right- px-0.5 py-px hidden"
        >
          <img
            v-lazy="otherAccount.avatar"
            class="h-5 w-5 rounded-full bg-white flex items-center justify-center border border-gray-50"
            alt=""
          >
        </span>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  account: useProp(Object),
  otherAccount: useProp(Object)
})

const route = (account) => {
  return `/app/timeline/profile/${account.id}`
}

</script>
