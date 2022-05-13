<template>
  <enclosure-container
    ref="refTimeline"
    :is-loading="store.isLoading"
    title="Thread"
  >
    <template #default>
      <enclosure-timeline
        type="thread"
        :toots="store.thread"
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
  console.log('*******', route?.params?.id)
  const id = route?.params?.id
  if (id) {
    await store.getThread(id)
  }
}, { immediate: true })

</script>
