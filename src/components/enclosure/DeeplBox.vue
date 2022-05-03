<template>
  <div v-if="lang !== 'de'">
    <div class="mb-2 mt-1 py-0.5">
      <div
        class="flex  "
      >
        <a
          v-if="!translation"
          class="flex items-center px-0.5 w-full group"
          :class="[translating ? 'cursor-none' : 'cursor-pointer']"
          @click="translate"
        >
          <span
            class="flex items-center text-xs text-blue-500 py-1 hover:underline"
            :class="[translating ? 'no-underline' : '']"
          >

            <stormy-icon
              :name="translating ? 'world' : 'language'"
              class="w-5 h-5 mr-1 duration-1000"
              :class="[translating ? 'animate-spin-slow text-orange-500' : '']"
              :stroke-width="translating ? 1 : 2"
            />
            <span :class="[translating ? 'text-transparent hidden' : 'visible']">
              Tröt mit DeepL übersetzen
            </span>
          </span>
          <span
            class=" text-transparent flex-1 text-xxs text-right group-hover:text-gray-500"
            :class="[translating ? 'text-transparent hidden' : 'visible']"
          >
            {{ props.toot.content.length }} / {{ limit }} <span class="text-transparent group-hover:text-gray-400">Zeichen (DeepL API Free)</span>
          </span>
        </a>
      </div>
      <span
        v-if="translation"
        class=" text-xxs text-right text-gray-500 bg-gray-200 px-2 py-1 border-blue-500 my-1.5 rounded-md inline-block"
      >
        DE
      </span>
      <div
        v-if="translation"
        class="mb-2 leading-normal text-gray-900 toot-content overflow-x-hidden"
        v-html="translation"
      />
    </div>
    <span
      v-if="translation"
      class="text-xxs text-gray-500 bg-gray-200 px-2 py-1 border-blue-500 my-1.5 rounded-md inline-block"
    >
      {{ langugage }} (Orignal)
    </span>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed, ref, onMounted, popScopeId } from 'vue'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import axios from 'axios'
import { sortBy, reverse } from 'lodash'
import { stri } from 'stristri'

import LanguageDetect from 'languagedetect'

const lngDetector = new LanguageDetect()
lngDetector.setLanguageType('iso2')

const { formatInt } = useTemplateFilter()
const emit = defineEmits(['translated'])

const props = defineProps({
  toot: useProp(Object),
  index: useProp(Number),
  lang: useProp(String),
  deepLimit: useProp(Number, 0)
})

const translating = ref(false)
const translation = ref('')
const langugage = ref('')
const limit = computed(() => formatInt(props.deepLimit))

const translate = async () => {
  const authKey = 'bfca006a-9a83-b5cd-786c-cbf877d89b26:fx' // Replace with your key
  translating.value = true
  try {
    const response = await axios
      .get('https://api-free.deepl.com/v2/translate', {
        params: {
          auth_key: authKey,
          text: props.toot.content,
          target_lang: 'de'
        },
        proxy: {
          host: 'localhost',
          port: 8080
        }
      })
    console.log(response)
    translation.value = response.data.translations[0].text
    langugage.value = response.data.translations[0].detected_source_language
  } catch (error) {
    console.log(error)
  }
  translating.value = false
}

const lang = computed(() => {
  const text = stri(props.toot.content)
  const languages = lngDetector.detect(text.result)
  const langsAsObject = languages.map(item => { return { lang: item[0], probability: item[1] } })
  const sorted = reverse(sortBy(langsAsObject, ['probability']))

  if (sorted && sorted.length) {
    return sorted[0].lang
  }

  return props.toot.language
})

</script>
