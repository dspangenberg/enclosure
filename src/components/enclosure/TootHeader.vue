<template>
  <enclosure-toot-container class="flex-1 flex border-b flex-col border-gray-100">
    <div class="flex flex-1 items-center">
      <div class="flex-shrink-0">
        <enclosure-toot-avatar
          :account="account"
          :other-account="otherAccount"
        />
      </div>
      <div class="flex flex-1 flex-col text-xs">
        <div class="text-sm flex-1 items-center  flex">
          <a
            :href="account.url"
            target="_blank"
            class="text-text-600 flex-1 flex items-center hover:underline"
          >
            <span class="flex-1 font-semibold mr-1 truncate flex">

              {{ account.display_name || account.username }}
            </span>

          </a>
        </div>
        <div class="flex items-center mt-0.5">
          <a
            :href="account.url"
            target="_blank"
            class="text-text-600 flex-1 flex items-center  hover:underline"
          >
            <span class="flex-1 text-gray-400 text-sm font-semibold">
              @{{ account.acct }}
            </span>
          </a>
          <span
            v-tooltip.tooltip="createdAtFormated"
            class="text-gray-400 text-sm font-semibold"
          >
            <stormy-time-ago :date="createdAt" />
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })
const actionText = computed(() => $t(props.action))

const { formatDate } = useTemplateFilter()

const props = defineProps({
  account: useProp(Object),
  otherAccount: useProp(Object),
  createdAt: useProp(String),
  icon: useProp(String, 'message'),
  action: useProp(String, 'toots.toot.actions.boost')
})

const createdAtFormated = computed(() => formatDate(props.createdAt))

</script>
