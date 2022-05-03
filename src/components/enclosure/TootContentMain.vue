<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-deepl-box
      :toot="toot"
      :deep-limit="deepLimit"
    />
    <div
      v-if="toot.content"
      class="leading-normal text-gray-900 toot-content overflow-x-hidden"
      v-html="toot.content"
    />
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed, ref } from 'vue'
import '@textabledev/langs-flags-list/lang-flags.css'
import * as deepl from 'deepl-node'
import axios from 'axios'

const { formatMarkdown, formatInt } = useTemplateFilter()

const props = defineProps({
  toot: useProp(Object),
  deepLimit: useProp(Number, 0)
})

const language = ref(null)

const onTranslated = (lang) => {
  language.value = lang
}

</script>
