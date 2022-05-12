<template>
  <li
    v-if="toot && isReady"
    ref="tootRef"
    class="hover:bg-blue-50/30 overflow-hidden text-base"
    style="font-size: 16px;line-height: 26px;"
  >
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
              :toot="item"
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

const props = defineProps({
  toot: useProp(Object),
  index: useProp(Number)
})

const isReady = ref(false)
const { toot } = toRefs(props)

const isReblog = computed(() => toot.value.reblog instanceof Object)
const item = computed(() => isReblog.value ? toot.value.reblog : toot.value)
const account = computed(() => isReblog.value ? toot.value.reblog.account : toot.value.account)
const createdAt = computed(() => isReblog.value ? toot.value.reblog.created_at : toot.value.created_at)
const otherAccount = computed(() => isReblog.value ? toot.value.account : null)

onMounted(async () => {
  await nextTick
  isReady.value = true
})

const log = () => {
  console.log(toot.value)
}

</script>
