<template>
  <div>
    <div class="border-t border-gray-100 grid grid-cols-3 mx-auto bg-gray-50 p-2 rounded-b-md ">
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="messages"
          class="w-5 h-5  mr-2.5 text-gray-500"
          :stroke-width="2"
        />
        <div class="text-gray-600 font-semibold text-xs">
          {{ toot.replies_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="message-2-share"
          class="w-5 h-5  mr-2.5 text-gray-500"
          :stroke-width="2"
        />
        <div class="text-gray-600 font-semibold text-xs">
          {{ toot.reblogs_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="heart"
          class="w-5 h-5  mr-2.5 text-gray-500"
          :stroke-width="2"
        />
        <div class="text-gray-600 font-semibold text-xs">
          {{ toot.favourites_count }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  toot: useProp(Object)
})

</script>
