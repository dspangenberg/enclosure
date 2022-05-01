<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-toot-container>
      <div
        v-if="toot.content"
        class="leading-normal text-gray-900 toot-content overflow-x-hidden"
        v-html="toot.content"
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
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed } from 'vue'
const { formatMarkdown } = useTemplateFilter()

const props = defineProps({
  toot: useProp(Object)
})

const formatedText = computed(() => formatMarkdown(props.toot.content))
const images = computed(() => props.toot.media_attachments && props.toot.media_attachments.length ? props.toot.media_attachments.filter(item => item.type === 'image') : null)

</script>
