<template>
  <div class=" pb-1.5  pt-1.5  px-0.5 border-gray-100 flex flex-1 ">
    <div class="flex flex-1 ">
      <div class="flex-shrink-1  flex items-center">
        <enclosure-toot-avatar
          :account="account"
          :other-account="otherAccount"
        />
      </div>
      <div class="flex flex-1 flex-col">
        <div class="text-base flex-1 items-center  flex">
          <a
            :href="account.url"
            target="_blank"
            class="text-text-600 flex-1 flex items-center"
          >
            <span class="flex-1 font-semibold mr-1 truncate flex">

              {{ account.display_name }}
            </span>
            <span
              v-tooltip.tooltip="createdAtFormated"
              class="text-gray-400 text-sm font-semibold"
            >
              <stormy-time-ago :date="createdAt" />
            </span>
          </a>
        </div>
        <div class="flex items-center mt-0.5">
          <span class="flex-1 text-gray-400 text-sm font-semibold">
            @{{ account.acct }}
          </span>
          <enclosure-toot-action-header
            v-if="otherAccount"
            :account="otherAccount"
            :icon="icon"
            :action="action"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed } from 'vue'

const { formatDate } = useTemplateFilter()

const props = defineProps({
  account: useProp(Object),
  otherAccount: useProp(Object),
  createdAt: useProp(String),
  icon: useProp(String, 'message'),
  action: useProp(String)
})

const createdAtFormated = computed(() => formatDate(props.createdAt))

</script>
