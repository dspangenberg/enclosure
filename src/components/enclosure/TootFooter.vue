<template>
  <enclosure-toot-container
    class=""
    inner-class="!my-0 py-3"
  >
    <div class="  grid grid-cols-5 mx-auto px-2 select-none">
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="messages"
          class="w-5 h-5 mr-2.5 hover:text-blue-700 cursor-pointer"
          :stroke-width="1"
        />
        <div class="text-gray-600  text-xs">
          {{ toot.replies_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="message-2-share"
          class="w-5 h-5 mr-2.5 hover:text-blue-900 cursor-pointer"
          :class="[toot.reblogged ? 'text-blue-500' : 'text-gray-500']"
          :stroke-width="toot.reblogged ? 2 : 1"
          @click="store.reblog(toot.id)"
        />
        <div class="text-gray-600 text-xs">
          {{ toot.reblogs_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="heart"
          class="w-5 h-5 mr-2.5 hover:text-blue-900 cursor-pointer"
          :class="[toot.favourited ? 'text-red-500' : 'text-gray-500']"
          :stroke-width="toot.favourited ? 2 : 1"
          @click="store.favorite(toot.id)"
        />
        <div class="text-gray-600 text-xs">
          {{ toot.favourites_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="bookmark"
          class="w-5 h-5 mr-2.5 hover:text-blue-900 cursor-pointer"
          :class="[toot.bookmarked ? 'text-blue-500' : 'text-gray-500']"
          :stroke-width="toot.bookmarked ? 2 : 1"
          @click="store.bookmark(toot.id)"
        />
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="terminal"
          class="w-5 h-5 mr-2.5 hover:text-gray-900 cursor-pointer text-gray-500"
          @click="$emit('log')"
        />
      </div>
    </div>
  </enclosure-toot-container>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useToots } from '@/stores/toots'

const store = useToots()

defineEmits(['log'])

defineProps({
  toot: useProp(Object)
})

</script>
