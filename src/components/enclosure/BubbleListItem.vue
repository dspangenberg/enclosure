<template>
  <div
    class="flex flex-1 items-start py-3 px-3 cursor-pointer"
    @click="onClick"
  >
    <div>
      <img
        v-lazy="person.avatar"
        class="h-10 w-10 rounded-full bg-white justify-center border-gray-200 p-[1px] cursor-pointer"
        alt=""
      >
    </div>
    <div class="flex-1 ml-3 space-y-1">
      <div
        class="base font-semibold leading-snug flex flex-1 items-center"
      >
        <div class="flex-1 items-center">
          <span
            v-if="displayName"
            v-html="$sanitize(displayName)"
          />
          <span v-else>{{ person.username }}</span>
        </div>
        <div v-if="!person.isMe">
          <stormy-badge
            v-if="person.followed_by"
            class="mr-6"
            color="orange"
            border
            text="Folgt Dir"
          />
        </div>
        <div
          class="flex space-x-3"
        >
          <stormy-icon-button
            v-if="!person.isMe"
            :icon="person.following ? 'user-x' : 'user-plus'"
            variant="outline"
            size="md"
          />&nbsp;
        </div>
      </div>
    </div>
  </div>
  <!--
    <div
          class="text-sm font-normal text-gray-700 toot-content"
          v-html="$sanitize(note)"
        />

        -->
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
import emojify from '@/utils/Emoji'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  me: useProp(Object),
  account: useProp(Object),
  person: useProp(Object)
})

const displayName = computed(() => {
  const emos = emojify(props.person.display_name, props.person.emojis)
  return emos
})

/*
const note = computed(() => {
  const emos = emojify(props.person.note, props.person.emojis)
  return emos
})
*/

const onClick = () => {
  router.push(`/app/timeline/profile/${props.person.id}`)
}

</script>
