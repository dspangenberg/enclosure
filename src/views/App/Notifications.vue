<template>
  <enclosure-container
    ref="refTimeline"
    i18n
    :is-loading="isLoading"
    title="timelines.titles.notifications"
  >
    <template #default>
      <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
        <div
          v-if="notifications.length"
          ref="timelineRef"
          class="flex-1 z-10 pt-12  w-full -mt-1"
        >
          <ul
            role="list"
          >
            <enclosure-notification
              v-for="(notification, index) of notifications"
              :key="index"
              :notification="notification"
            />
          </ul>
        </div>
        <div
          v-else
          class="w-xl flex-1 w-xl items-center"
        >
          <stormy-icon
            name="mood-empty"
            class="text-gray-300 mx-auto drop-shadow-xl w-20 h-20"
          />
          <div class="relative p-8 text-center">
            <h2 class="text-2xl font-medium">
              Hier gibt es noch nichts zu sehen
            </h2>
            <p class="mt-4 text-sm text-gray-500">
              Fall mit Deinen Tröts auf und Du wirst Benachrichtigungen erhalten.
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #aside>
      &nbsp;
    </template>
  </enclosure-container>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import useEmitter from '@/composables/useEmitter'
import { useMegalodon } from '@/composables/useMegalodon.js'

const notifications = ref([])
const isLoading = ref(false)
const { getNotifications } = useMegalodon()
const emitter = useEmitter()

onMounted(async () => {
  isLoading.value = true
  notifications.value = await getNotifications({ limit: 50 })
  isLoading.value = false
  console.log(notifications.value)
})

</script>
