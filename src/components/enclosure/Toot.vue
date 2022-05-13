<template>
  <li
    v-if="toot && isReady"
    ref="tootRef"
    class="hover:bg-blue-50/30 overflow-hidden text-base cursor-pointer relative pr-3"
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
      :toot="item"
      :icon="isReblog ? 'message-2-share' : 'message'"
      :type="isReblog ? 'reblog' : 'toot'"
      action="toots.toot.actions.boost"
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
            :icon="isReblog ? 'message-2-share' : 'message'"
            :type="isReblog ? 'reblog' : 'toot'"
            action="toots.toot.actions.boost"
          />
          <div>
            <enclosure-toot-content
              class="ml-[3.4rem]"
              :class="isKingOfThread ? 'text-lg' : ''"
              :toot="item"
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
import { computed, toRefs, ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  toot: useProp(Object),
  index: useProp(Number)
})

const router = useRouter()
const route = useRoute()

const isReady = ref(false)
const { toot } = toRefs(props)

const isReblog = computed(() => toot.value.reblog instanceof Object)
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

onMounted(async () => {
  await nextTick
  isReady.value = true
})

const log = () => {
  console.log(toot.value)
}

</script>
