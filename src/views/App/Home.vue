<template>
  <enclosure-container
    ref="refTimeline"
    :is-loading="store.isLoading"
    :title="getTitle"
  >
    <template #default>
      <enclosure-timeline
        :type="timelineType"
      />
    </template>
    <template #aside>
      <div class="flex flex-1 flex-col relative">
        <div class="flex-1 sticky">
          <enclosure-trends />
          <div class="sticky top-24">
            <enclosure-suggestions />
          </div>
        </div>
        <div class="text-base text-gray-400 mx-2 my-4  sticky top-96">
          <div class="">
            bleep
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

console.log(route.params.p)

watch(route, async (route) => {
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, route?.params?.p || null)
}, { immediate: true })

const loadMore = async (e) => {
  if (store.loadMoreQuery) {
    await store.loadMore(route?.params?.type || 'home', {}, route?.params?.p || null)
  }
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
    return `${i18} #${route.params.p}`
  }

  return $t(`timelines.titles.${route?.params?.type}`)
})

</script>
