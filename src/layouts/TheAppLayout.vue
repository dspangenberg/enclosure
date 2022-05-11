<template>
  <div
    ref="scrollRef"
    class="h-screen overflow-auto flex flex-col w-full bg-white z-10"
  >
    <div class="flex-1 flex container mx-auto w-auto">
      <div class="flex-shrink-0 relative w-64 ">
        <TheAppSidebar class="fixed h-full ">
          <TheAppSidebarMenuTop />
          <template #bottom>
            <TheAppSidebarMenuBottom />
          </template>
        </TheAppSidebar>
      </div>
      <router-view />
      <div class="absolute top-3 right-3">
        <TheAppLanguageSwitcher />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TheAppSidebar from './components/TheAppSidebar.vue'
import TheAppSidebarMenuTop from './components/TheAppSidebarMenuTop.vue'
import TheAppSidebarMenuBottom from './components/TheAppSidebarMenuBottom.vue'
import TheAppLanguageSwitcher from './components/TheAppLanguageSwitcher.vue'
import { useInfiniteScroll } from '@vueuse/core'
import useEmitter from '@/composables/useEmitter'
import { useToots } from '@/stores/toots'

import { useStore } from '@/stores/global'

const store = useStore()
const tootStore = useToots()
const socket = ref()
const accessToken = ref()

watch(accessToken, (value) => {
  if (value) {
    console.log('hey, hey')
    const url = `wss://mastodon.social/api/v1/streaming?access_token=${value}&stream=user`
    const ws = new WebSocket(url)
    console.log(ws)
    ws.onerror = function (error) {
      console.log(error)
    }
    ws.onerror = (e) => {
      console.log(e)
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const payload = JSON.parse(data.payload)

      if (data.event === 'update') {
        tootStore.tootOverSocket(payload)
      }

      console.log(data, payload)
    }
    ws.onclose = (e) => {
      console.log(e)
    }
  }
})

const emitter = useEmitter()
const scrollRef = ref()

useInfiniteScroll(
  scrollRef,
  async () => {
    await emitter.emitAsync('loadMore')
  },
  { distance: 450 }
)

onMounted(async () => {
  accessToken.value = await store.getAccessToken()
})
</script>
