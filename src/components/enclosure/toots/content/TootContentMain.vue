<template>
  <div class="text-base text-gray-700 overflow-hidden">
    <div
      v-if="toot.spoiler_text"
    >
      <div class="font-semibold mb-2 w-full overflow-hidden">
        <div>
          {{ toot.spoiler_text }}
        </div>
        <div
          class="text-xs text-right text-gray-500 border bg-gray-50 mx-auto py-1 border-gray-200 my-1.5 rounded-md inline-block cursor-pointer"
          @click="visible = !visible"
        >
          Zum Anzeigen des ganzen Tröts klicken
        </div>
      </div>
    </div>
    <a
      v-if="lang !== 'de' && !hasTranslation"
      class="inline-flex items-center text-sm text-blue-500"
      @click.stop="store.translate(toot)"
    >
      <stormy-icon
        name="language"
        class="w-5 h-5 mr-1 duration-1000"
      />
      Übersetzen
    </a>
    <div
      v-if="hasTranslation"
      class="text-sm font-medium pb-2 text-gray-400 "
    >
      Übersetzung durch {{ toot.translation?.provider }}
    </div>
    <div
      v-if="toot.translation?.content && visible"
      ref="tootRef"
      class="container leading-normal text-gray-900 toot-content overflow-hidden"
      :class="toot.isKingOfThread ? 'text-lg font-medium' : ''"
      v-html="$sanitize(toot.translation.content)"
    />
    <div
      v-if="toot.content && visible"
      ref="tootRef"
      class="container leading-normal  toot-content overflow-hidden"
      :class="[toot.isKingOfThread ? 'text-lg font-medium' : '', hasTranslation ? ' text-gray-400 pt-2' : 'text-gray-900']"
      v-html="$sanitize(content)"
    />
  </div>
</template>
<script setup>

import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'
import { computed, onMounted, ref, nextTick, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import emojify from '@/utils/Emoji'
import { useToots } from '@/stores/toots'

const store = useToots()

const router = useRouter()
const { getRoute } = useTemplateFilter()

const props = defineProps({
  toot: useProp(Object),
  lang: useProp(String, 'de')
})

const { toot, lang } = toRefs(props)

const content = computed(() => {
  const emos = emojify(props.toot.content, props.toot.emojis)
  return emos
})
const tootRef = ref()
const visible = ref(true)
const currentLang = ref(lang.value)

const hasTranslation = computed(() => !!toot.value?.translation?.content)

watch(hasTranslation, async (has) => {
  console.log('hasTranslation', hasTranslation.value)
  if (has) {
    currentLang.value = 'de'
  } else {
    currentLang.value = lang.value
  }
}, { immediate: true })

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
