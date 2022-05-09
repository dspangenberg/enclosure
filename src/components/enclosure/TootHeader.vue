<template>
  <enclosure-toot-container
    class="flex-1 flex flex-col border-gray-100 mt-2  "
  >
    <div class="flex flex-1 items-center ">
      <div class="flex-shrink-0 select-none">
        <enclosure-toot-avatar
          :account="account"
          :other-account="otherAccount"
        />
      </div>
      <div class="flex flex-1 flex-col text-xs">
        <div class="text-sm flex-1 items-center  fle">
          <router-link
            :to="route(account)"
            class="text-text-600 flex-1 flex items-center "
          >
            <span class="flex-1 text-base font-semibold mr-1 truncate flex">
              <span
                v-if="displayName"
                v-html="displayName"
              />
              <span
                v-else
                class="hover:underline"
              >
                {{ account.username }}
              </span>
            </span>
          </router-link>
        </div>
        <div class="flex items-center mt-0.5">
          <router-link
            :to="route(account)"
            class="text-text-600 flex-1 flex items-center  hover:underline"
          >
            <span class="flex-1 text-gray-400 text-sm font-semibold">
              @{{ account.acct }}
            </span>
          </router-link>
          <span
            v-tooltip.tooltip="createdAtFormated"
            class="text-gray-400 text-sm font-semibold select-none"
          >
            <stormy-time-ago :date="createdAt" />
          </span>

          <span
            v-tooltip.tooltip="visibilityText"
            class="flex justify-center select-none"
          >
            <stormy-icon
              :name="visibilityIcon"
              class="w-4 h-4  ml-1 text-gray-500 flex-shrink-0"
              :stroke-width="2"
            />
          </span>
        </div>
      </div>
    </div>
  </enclosure-toot-container>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed } from 'vue'
import emojify from '@/utils/Emoji'

const { formatDate } = useTemplateFilter()

const props = defineProps({
  account: useProp(Object),
  toot: useProp(Object),
  otherAccount: useProp(Object),
  createdAt: useProp(String),
  icon: useProp(String, 'message'),
  action: useProp(String, 'toots.toot.actions.boost')
})

const createdAtFormated = computed(() => formatDate(props.createdAt))

const displayName = computed(() => {
  const emos = emojify(props.account.display_name, props.account.emojis)
  return emos
})

const visibilityIcon = computed(() => {
  switch (props.toot.visibility) {
    case 'unlisted':
      return 'lock-open'
    case 'private':
      return 'lock'
    case 'direct':
      return 'at'
    default:
      return 'world'
  }
})

const visibilityText = computed(() => {
  switch (props.toot.visibility) {
    case 'unlisted':
      return 'nicht gelistet'
    case 'private':
      return 'nur für Folgende'
    case 'direct':
      return 'Direktnachricht'
    default:
      return 'Öffentlich'
  }
})

const route = (account) => {
  return `/app/timeline/profile/${account.id}`
}

</script>
