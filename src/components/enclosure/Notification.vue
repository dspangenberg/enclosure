<template>
  <li class="px-3 py-3">
    <div class="flex-1 flex items-center">
      <div class="flex pl-2 flex-1">
        <div
          v-if="notification.account"
          class="flex text-xs items-center flex-1"
        >
          <div class="flex items-center mr-3">
            <span class="rounded-full border border-gray-200">
              <img
                class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center border-2 border-white"
                :src="notification.account.avatar"
                alt=""
              >
            </span>
          </div>
          <div
            class="flex items-left flex-1 flex-col"
          >
            <div class="flex flex-1">
              <router-link
                :to="route(notification.account)"
                class="hover:underline text-gray-500 flex items-center flex-1"
              >
                <div class="flex-1">
                  <span class="text-base ml-3 font-semibold">
                    <span v-if="displayName">
                      <span
                        v-html="$sanitize(displayName)"
                      /></span>
                    <span
                      v-else
                      class="truncate"
                    >
                      @{{ notification.account.username }}</span>
                  </span>
                  <span class="text-base">&nbsp;{{ actionName }}</span>
                </div>
                <div>
                  <span
                    v-tooltip.tooltip="createdAt"
                    class="text-gray-400 text-sm select-none mr-3"
                  >
                    <stormy-time-ago :date="notification.created_at" />
                  </span>
                </div>
              </router-link>
            </div>
            <div
              v-if="content"
              class="border mt-1 rounded-md px-3 py-2 text-gray-900 text-base toot-content"
            >
              {{ content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
import emojify from '@/utils/Emoji'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'
import { useI18n } from 'vue-i18n'
import { stri } from 'stristri'
import emoji from 'node-emoji'

const { t: $t } = useI18n({ useScope: 'global' })

const props = defineProps({
  notification: useProp(Object)
})

const { formatDate } = useTemplateFilter()
const createdAt = computed(() => formatDate(props.notification.created_at))

const displayName = computed(() => {
  const emos = emojify(props.notification.account.display_name, props.notification?.account?.emojis)
  return emos
})

const content = computed(() => {
  if (props.notification?.status?.content) {
    const rawText = stri(props.notification?.status?.content)
    return emoji.strip(rawText.result)
  }
  return ''
})

const actionName = computed(() => $t(`notifications.types.${props.notification.type}`))

const route = () => {
  return `/app/timeline/profile/${props.notification.account.id}`
}

</script>
