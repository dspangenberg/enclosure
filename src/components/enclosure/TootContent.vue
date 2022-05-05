<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-toot-container>
      <enclosure-toot-content-main
        :toot="toot"
      />
    </enclosure-toot-container>
    <enclosure-toot-container>
      <enclosure-toot-content-card
        v-if="toot.card"
        :toot="toot"
      />
    </enclosure-toot-container>
    <enclosure-toot-container>
      <enclosure-toot-content-media
        v-if="images && images.length"
        :images="images"
      />
    </enclosure-toot-container>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const images = computed(() => props.toot.media_attachments && props.toot.media_attachments.length ? props.toot.media_attachments.filter(item => item.type === 'image') : null)

const props = defineProps({
  toot: useProp(Object)
})

</script>
