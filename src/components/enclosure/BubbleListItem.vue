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
        <div class="flex-1">
          <span
            v-if="displayName"
            v-html="displayName"
          />
          <span v-else>{{ person.username }}</span>
        </div>
        <div>
          <stormy-badge
            v-if="isFollower"
            class="mr-6"
            color="orange"
            border
            text="Folgt Dir"
          />
        </div>
        <div
          v-if="person.id !== me.accountId"
          class="flex space-x-3"
        >
          <stormy-icon-button
            v-if="!isMe"
            :icon="isFollowedByMe ? 'user-x' : 'user-plus'"
            variant="outline"
            size="md"
          />
          <stormy-icon-button
            v-if="!isMe"
            icon="dots-vertical"
            variant="outline"
            size="md"
          />
        </div>
      </div>
    </div>
  </div>
  <!--
    <div
          class="text-sm font-normal text-gray-700 toot-content"
          v-html="note"
        />

        -->
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed, ref } from 'vue'
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

const note = computed(() => {
  const emos = emojify(props.person.note, props.person.emojis)
  return emos
})
const isFollower = computed(() => {
  console.log(props.person.id)
  const follower = props.me.follower.map(item => parseInt(item))
  return follower.includes(parseInt(props.person.id))
})
const isFollowedByMe = computed(() => {
  console.log(props.person.id)
  const follower = props.me.following.map(item => parseInt(item))
  return follower.includes(parseInt(props.person.id))
})

const isMe = computed(() => props.person.id === props.me.accountId)

const onClick = () => {
  router.push(`/app/timeline/profile/${props.person.id}`)
}

</script>
