<template>
  <div class="text-base text-gray-700 overflow-x-clip">
    <enclosure-toot-container>
      <enclosure-toot-content-main
        :deep-limit="deepLimit"
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
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed, ref } from 'vue'
import '@textabledev/langs-flags-list/lang-flags.css'
import * as deepl from 'deepl-node'
import axios from 'axios'
import LanguageDetect from 'languagedetect'

const lngDetector = new LanguageDetect()
lngDetector.setLanguageType('iso2')

const { formatMarkdown, formatInt } = useTemplateFilter()

const props = defineProps({
  toot: useProp(Object),
  deepLimit: useProp(Number, 0)
})

const translated = ref(null)
const limit = ref(null)
const limitChars = ref(null)

const formatedText = computed(() => formatMarkdown(props.toot.content))
const images = computed(() => props.toot.media_attachments && props.toot.media_attachments.length ? props.toot.media_attachments.filter(item => item.type === 'image') : null)

const translate = async () => {
  const authKey = 'bfca006a-9a83-b5cd-786c-cbf877d89b26:fx' // Replace with your key

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
    const response2 = await axios
      .get('https://api-free.deepl.com/v2/usage', {
        params: {
          auth_key: authKey
        },
        proxy: {
          host: 'localhost',
          port: 8080
        }
      })

    // const translator = new deepl.Translator('bfca006a-9a83-b5cd-786c-cbf877d89b26:fx')
    // console.log(await translator.getUsage())
    console.log(response, response2)

    limit.value = formatInt(Math.round((response2.data.character_limit - response2.data.character_count) / 500))
    limitChars.value = formatInt(response2.data.character_limit - response2.data.character_count)

    translated.value = response.data.translations[0].text
  } catch (error) {
    console.log(error)
  }

  // console.log(translator)
/*

curl -H "Authorization: DeepL-Auth-Key bfca006a-9a83-b5cd-786c-cbf877d89b26:fx" https://api-free.deepl.com/v2/usage
  const result = await translator.translateText(props.toot.content, 'en', 'de')
  translated.value = result.text
  */
}

</script>
