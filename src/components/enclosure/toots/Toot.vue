<template>
  <li
    v-if="toot && isReady"
    ref="tootRef"
    class="hover:bg-blue-50/30 overflow-hidden text-base cursor-pointer relative pr-3 "
    :class="isKingOfThread ? 'bg-gray-50' : ''"
  >
    <div
      v-if="isThread && !isKingOfThread"
      class="absolute left-9 top-16 -bottom-24 -ml-px h-full w-0.5 bg-gray-200 hidden"
      aria-hidden="true"
    />
    <enclosure-toot-reblog-info
      :account="account"
      :created-at="createdAt"
      :other-account="otherAccount"
      :show-user="showUser"
      :icon="action.icon"
      :icon-color="action.color"
      :type="isReblog ? 'reblog' : 'toot'"
      :action="action.action"
    />
    <div class="relative flex items-start ">
      <div
        class="min-w-0 flex-1 text-base "
      >
        <div class="min-w-0 flex-1">
          <enclosure-toot-header
            :account="account"
            :created-at="createdAt"
            :toot="item"
            :other-account="otherAccount"
            :icon="action.icon"
            :type="isReblog ? 'reblog' : 'toot'"
          />
          <div>
            <enclosure-toot-content
              class="ml-[3.4rem]"
              :class="isKingOfThread ? 'text-lg' : ''"
              :toot="item"
              :lang="lang"
              @click="goThread(toot)"
            />
          </div>
          <enclosure-toot-footer
            :toot="item"
            @log="log"
          />
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed, toRefs, ref, onMounted, nextTick, watch } from 'vue'
import { useStore } from '@/stores/global'
import { useRoute, useRouter } from 'vue-router'
import LanguageDetect from 'languagedetect'
import { stri } from 'stristri'
import { sortBy, reverse } from 'lodash'

const lngDetector = new LanguageDetect()
lngDetector.setLanguageType('iso2')

const props = defineProps({
  toot: useProp(Object),
  index: useProp(Number)
})

const { toot } = toRefs(props)

const lang = computed(() => {
  const text = stri(toot.value.content || toot.value.reblog.content)
  const languages = lngDetector.detect(text.result)
  const langsAsObject = languages.map(item => { return { lang: item[0], probability: item[1] } })
  const sorted = reverse(sortBy(langsAsObject, ['probability']))

  if (sorted && sorted.length) {
    return sorted[0].lang
  }

  return props.toot.language
})

const store = useStore()
const router = useRouter()
const route = useRoute()

const isReady = ref(false)
const currentLang = ref(lang.value)

const isReblog = computed(() => toot.value.reblog instanceof Object)
const showUser = computed(() => route.params?.type !== 'profile')
const item = computed(() => isReblog.value ? toot.value.reblog : toot.value)
const account = computed(() => isReblog.value ? toot.value.reblog.account : toot.value.account)
const createdAt = computed(() => isReblog.value ? toot.value.reblog.created_at : toot.value.created_at)
const otherAccount = computed(() => isReblog.value ? toot.value.account : null)
const isThread = computed(() => route.name === 'thread')
const isKingOfThread = computed(() => route.name === 'thread' && route.params.id === item.value.id)
const goThread = (toot) => {
  const path = isReblog.value === true ? `/app/status/${toot.reblog.id}` : `/app/status/${toot.id}`
  router.push(path)
}

const action = computed(() => {
  if (isReblog.value) {
    return { action: showUser.value ? 'reblog' : '', icon: 'message-2-share', color: 'text-gray-500' }
  }

  if (item.value.pinned) {
    return { action: 'pinned', icon: 'pin', color: 'text-purple-500' }
  }

  if (item.value.in_reply_to_id) {
    // return { action: 'answered', icon: 'messages' }
  }

  return { action: '', icon: 'message' }
})

onMounted(async () => {
  await nextTick
  isReady.value = true
})

const log = () => {
  console.log(toot.value)
}

</script>
