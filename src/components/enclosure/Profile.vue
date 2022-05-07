<template>
  <div
    v-if="account"
    class="mb-4"
  >
    <div class="">
      <img
        class="h-32 w-full object-cover lg:h-48"
        :src="account.header"
        alt=""
      >
    </div>
    <div class="max-w-5xl mx-auto px-4">
      <div class="-mt-10 flex space-x-5 items-center">
        <div class="flex">
          <div class="border-gray-100">
            <img
              class="h-[5.5rem] w-[5.5rem] rounded-full ring-4 ring-white "
              :src="account.avatar"
              alt=""
            >
          </div>
        </div>
        <div class="mt-12 flex-1">
          <div class="flex flex-1 items-center">
            <div class="text-xl font-bold text-gray-900 truncate -pl-2 flex-1">
              {{ account.display_name }}
              <div class="text-sm text-gray-400">
                @{{ account.acct }}
              </div>
            </div>
            <div class="space-x-1 flex items-center content-center">
              <stormy-icon-button
                icon="pencil"
                variant="outline"
                size="md"
              />
              <stormy-icon-button
                icon="dots-vertical"
                variant="outline"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="text-base text-gray-800 mx-5 my-4 toot-content"
      v-html="account.note"
    />
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'
import { computed } from 'vue'

const { formatDate } = useTemplateFilter()

const props = defineProps({
  account: useProp(Object)
})

const createdAt = computed(() => formatDate(props.account.created_at))
const lastStatusAt = computed(() => formatDate(props.account.last_status_at))
</script>
