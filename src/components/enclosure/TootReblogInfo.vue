<template>
  <div class="flex pl-2">
    <div
      v-if="otherAccount"
      class="flex text-xs items-center flex-1"
    >
      <div
        class="flex items-center pt-2 pb-0 mb-0 px-2 flex-1 border-gray-200"
      >
        <stormy-icon
          :name="icon"
          class="w-5 h-5 text-gray-400 mr-2"
          :stroke-width="2"
        />
        <span class="text-gray-500 mr-0.5">{{ actionText }}</span>
        <router-link
          :to="route(otherAccount)"
          class="hover:underline text-gray-500 flex items-center"
        >
          <img
            class="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center border border-white mx-0.5"
            :src="otherAccount.avatar"
            alt=""
          >
          <span>{{ displayName || otherAccount.username }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import emoji from 'node-emoji'
const { t: $t } = useI18n({ useScope: 'global' })
const actionText = computed(() => $t(props.action))

const displayName = computed(() => emoji.strip(props.otherAccount.display_name))

const props = defineProps({
  account: useProp(Object),
  otherAccount: useProp(Object),
  createdAt: useProp(String),
  icon: useProp(String, 'message'),
  action: useProp(String, 'toots.toot.actions.boost')
})

const route = (account) => {
  return `/app/timeline/profile/${account.id}`
}

</script>
