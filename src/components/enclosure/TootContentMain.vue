<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-deepl-box
      :toot="toot"
    />
    <div
      v-if="toot.spoiler_text"
    >
      <div class="font-semibold mb-2 w-full">
        <div>
          {{ toot.spoiler_text }}
        </div>
        <div
          class="text-xs text-right text-gray-500 border bg-gray-50 px-2 py-1 border-gray-200 my-1.5 rounded-md inline-block cursor-pointer"
          @click="visible = !visible"
        >
          Zum Anzeigen des ganzen Trötz' klicken
        </div>
      </div>
    </div>
    <div
      v-if="toot.content && visible"
      ref="tootRef"
      class="container leading-normal text-gray-900 toot-content overflow-x-hidden"
      v-html="$sanitize(content)"
    />
  </div>
</template>
<script setup>

import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import emojify from '@/utils/Emoji'
const router = useRouter()
const { getRoute } = useTemplateFilter()

const props = defineProps({
  toot: useProp(Object)
})

const content = computed(() => {
  const emos = emojify(props.toot.content, props.toot.emojis)
  return emos
})
const tootRef = ref()
const visible = ref(true)

const onMastodonClick = (event) => {
  const el = event.target.closest('a') || event.srcElement.closest('a')
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href')
    if (href) {
      const route = getRoute(href, props.toot.mentions)
      if (route) {
        event.preventDefault()
        router.push(route)
      }
    }
  }
}

onMounted(async () => {
  await nextTick()
  if (props.toot.spoiler_text) visible.value = false
  if (tootRef.value) {
    const tags = tootRef.value.querySelectorAll('.mention')
    if (tags.length) {
      tags.forEach((input) => input.addEventListener('click', (e) => onMastodonClick(e)))
    }
  }
})
</script>
