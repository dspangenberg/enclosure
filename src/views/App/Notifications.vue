<template>
  <enclosure-container
    ref="refTimeline"
    title="Benachrichtigungen"
  >
    <template #default>
      <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
        <template
          v-if="!isLoading"
        >
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
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
          </transition>
        </template>
        <template v-else>
          <div class="w-xl  flex-1 w-xl items-center">
            <div class="flower-spinner mx-auto">
              <div class="dots-container">
                <div class="bigger-dot">
                  <div class="smaller-dot" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template #aside>
      &nbsp;
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed, onMounted, ref } from 'vue'
import useEmitter from '@/composables/useEmitter'
import { useI18n } from 'vue-i18n'
import { useMegalodon } from '@/composables/useMegalodon.js'

const notifications = ref([])
const isLoading = ref(false)
const { getNotifications } = useMegalodon()

const { t: $t } = useI18n({ useScope: 'global' })
const emitter = useEmitter()

onMounted(async () => {
  notifications.value = await getNotifications({ limit: 50 })
  console.log(notifications.value)
})

</script>
