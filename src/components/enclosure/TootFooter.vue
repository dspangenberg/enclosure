<template>
  <enclosure-toot-container
    class=""
    inner-class="!my-0 py-3"
  >
    <div class="  grid grid-cols-4 mx-auto px-2 select-none">
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="messages"
          class="w-5 h-5 mr-2.5 text-gray-500"
          :stroke-width="1"
        />
        <div class="text-gray-600  text-xs">
          {{ toot.replies_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="message-2-share"
          class="w-5 h-5 mr-2.5 "
          :class="[toot.reblogged ? 'text-blue-500' : 'text-gray-500']"
          :stroke-width="toot.reblogged ? 2 : 1"
        />
        <div class="text-gray-600 text-xs">
          {{ toot.reblogs_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="heart"
          class="w-5 h-5 mr-2.5 cursor-pointer"
          :class="[toot.favourited ? 'text-red-500' : 'text-gray-500']"
          :stroke-width="toot.favourited ? 2 : 1"
          @click="toogleFavorite"
        />
        <div class="text-gray-600 text-xs">
          {{ toot.favourites_count }}
        </div>
      </div>
      <div class="flex items-center mx-auto">
        <stormy-icon
          name="bookmark"
          class="w-5 h-5 mr-2.5"
          :class="[toot.bookmarked ? 'text-blue-500' : 'text-gray-500']"
          :stroke-width="toot.bookmarked ? 2 : 1"
        />
      </div>
    </div>
  </enclosure-toot-container>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useMegalodon } from '@/composables/useMegalodon.js'

const { favouriteStatus, unfavouriteStatus } = useMegalodon()

const props = defineProps({
  toot: useProp(Object)
})

const toogleFavorite = async () => {
  let result = null
  if (props.toot.favourited) {
    result = await unfavouriteStatus(props.toot.id)
  } else {
    result = await favouriteStatus(props.toot.id)
  }
  console.log(result)
}

</script>
