<template>
  <div class="flex">
    <div
      v-if="otherAccount"
      class="flex text-xs items-center flex-1"
    >
      <div
        class="flex items-center mb-1 py-1 px-2 flex-1 border-gray-200"
      >
        <stormy-icon
          :name="icon"
          class="w-5 h-5 text-gray-400 mr-2"
          :stroke-width="2"
        />
        <span class="text-gray-500 mr-0.5">{{ actionText }}</span>
        <a
          :href="otherAccount.url"
          class="hover:underline text-gray-800 font-semibold flex items-center"
        >
          <img
            class="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center border border-white mx-0.5"
            :src="otherAccount.avatar"
            alt=""
          >
          <span>{{ otherAccount.display_name }}</span>
        </a>
      </div>
    </div>
  </div>
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
