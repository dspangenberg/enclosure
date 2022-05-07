<template>
  <li class="flex flex-col">
    <div class=" pb-8 ">
      <enclosure-toot-sys-info
        :account="toot.account"
        icon="message-2-share"
        action="toots.toot.actions.boost"
      />
      <div class="relative flex items-start space-x-3">
        <div class="relative">
          <img
            class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
            :src="account.avatar"
            alt=""
          >
          <span class="absolute -bottom-0.5 -right-1  px-0.5 py-px">
            <img
              class="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
              :src="toot.account.avatar"
              alt=""
            >
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div>
            <enclosure-toot-header
              :account="reblog.account"
              :created-at="reblog.created_at"
            />
            <enclosure-toot-content :content="reblog.content" />
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
/* eslint-disable vue/no-v-html */
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  toot: useProp(Object)
})

const reblog = computed(() => props.toot.reblog || {})
const account = computed(() => reblog.value?.account || {})

const route = (account) => {
  return `/app/timeline/profile/${account.id}`
}

</script>
