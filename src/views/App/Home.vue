<template>
  <enclosure-container
    ref="refTimeline"
    :is-loading="store.isLoading"
    :title="getTitle"
  >
    <template #default>
      <enclosure-timeline
        :type="timelineType"
        :toots="store.toots"
      />
    </template>
    <template #aside>
      <div class="flex flex-1 flex-col relative">
        <div class="flex-1 sticky">
          <template v-if="route.params.type === 'profile'">
            x
          </template>
          <template v-else>
            <enclosure-trends />
            <div class="sticky top-24">
              <enclosure-suggestions />
            </div>
          </template>
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
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, route?.params?.p || null)
}, { immediate: true })
emitter.on('loadMore', async (e) => await loadMore(e))

const loadMore = async (e) => {
  if (store.loadMoreQuery) {
    await store.loadMore(route?.params?.type || 'home', {}, route?.params?.p || null)
  }
}

const timelineType = computed(() => route?.params?.type || 'home')

emitter.on('loadMore', async (e) => await loadMore(e))

const getTitle = computed(() => {
  if (!route?.params?.type) return `Oops ${route?.params?.type}`

  if (route?.params?.type === 'profile' && store.account) {
    return `@${store.account.acct}`
  }

  if (route?.params?.type === 'list') {
    const i18 = $t(`timelines.titles.${route?.params?.type}`)
    return `${i18} ${store.list?.title}`
  }

  if (route?.params?.type === 'tags') {
    const i18 = $t(`timelines.titles.${route?.params?.type}`)
    return `${i18} #${route.params.p}`
  }

  return $t(`timelines.titles.${route?.params?.type}`)
})

</script>
