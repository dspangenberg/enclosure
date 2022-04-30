<template>
  <div class=" mt-2 px-0.5 border-gray-100 grid grid-cols-4 mx-auto bg-gray-100 p-2 rounded-b-md shadow-md">
    <div class="flex items-center mx-auto">
      <stormy-icon
        name="messages"
        class="w-5 h-5  mr-2.5 text-gray-500"
        :stroke-width="1.5"
      />
      <div>
        {{ item.replies_count }}
      </div>
    </div>
    <div class="flex items-center mx-auto">
      <stormy-icon
        name="message-2-share"
        class="w-5 h-5  mr-2.5 text-gray-500"
        :stroke-width="1.5"
      />
      <div>
        {{ item.reblogs_cout }}
      </div>
    </div>
    <div class="flex items-center mx-auto">
      <stormy-icon
        name="heart"
        class="w-5 h-5  mr-2.5 text-gray-500"
        :stroke-width="1.5"
      />
      <div>
        {{ item.favourites_count }}
      </div>
    </div>

    <div class="flex items-center mx-auto">
      <stormy-icon
        name="dots-circle-horizontal"
        class="w-5 h-5  mr-2.5 text-gray-500"
        :stroke-width="1.5"
      />
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

const props = defineProps({
  item: useProp(Object)
})

</script>
