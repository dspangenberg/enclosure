<template>
  <enclosure-container
    ref="refTimeline"
    :title="getTitle"
  >
    <template #default>
      <enclosure-timeline
        :type="timelineType"
      >
        <template
          #header
        >
          <enclosure-profile :account="store.account" />
        </template>
      </enclosure-timeline>
    </template>
    <template #aside>
      <div class="flex flex-1 flex-col relative">
        <div class="flex-1 sticky">
          <enclosure-trends />
          <div class="sticky top-24">
            <enclosure-suggestions />
          </div>
        </div>
        <div class="text-sm text-gray-400 mx-2 my-4 releative">
          <div class="sticky top-64">
            Blabla
          </div>
        </div>
      </div>
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToots } from '@/stores/toots'
import useEmitter from '@/composables/useEmitter'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })
const emitter = useEmitter()

const store = useToots()
const route = useRoute()

watch(route, async (route) => {
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, null, route?.params?.tag || null)
}, { immediate: true })

const loadMore = async (e) => {
  await store.loadMore(route?.params?.type || 'home', {}, null, route?.params?.tag || null)
}

const timelineType = computed(() => route?.params?.type || 'home')
const isProfile = computed(() => route?.params?.type === 'profile')

emitter.on('loadMore', async (e) => await loadMore(e))

const getTitle = computed(() => {
  if (!route?.params?.type) return `Oops ${route?.params?.type}`

  if (route?.params?.type === 'profile' && store.account) {
    return `@${store.account.acct}`
  }

  if (route?.params?.type === 'tags') {
    const i18 = $t(`timelines.titles.${route?.params?.type}`)
    return `${i18} #${route.params.tag}`
  }

  return $t(`timelines.titles.${route?.params?.type}`)
})

</script>
