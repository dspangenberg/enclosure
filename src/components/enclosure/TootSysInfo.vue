<template>
  <enclosure-toot-container>
    <div class="flex border-0 flex-1 text-xs items-center">
      <div class="flex items-center flex-1">
        <stormy-icon
          :name="visibilityIcon"
          class="w-4 h-4  mr-1 text-gray-300 flex-shrink-0"
          :stroke-width="2"
        />
        <span class="text-gray-600 mr-0.5 flex-shrink-0">{{ visibilityText }}</span>
      </div>
      <div
        v-if="toot.application"
        class="flex items-center"
      >
        <stormy-icon
          name="apps"
          class="w-4 h-4  mr-1 text-gray-300 flex-shrink-0"
          :stroke-width="2"
        />
        <stormy-link
          class="text-gray-600 mr-0.5 flex-shrink-0"
          :label="toot.application.name"
          :link="toot.application.url"
          as="span"
        />
      </div>
    </div>
  </enclosure-toot-container>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  account: useProp(Object),
  toot: useProp(Object),
  icon: useProp(String, 'message-2-share')
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

</script>
