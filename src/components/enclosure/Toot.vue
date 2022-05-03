<template>
  <li
    v-if="toot"
    class="hover:bg-gray-50"
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
            :other-account="otherAccount"
            :icon="isReblog ? 'message-2-share' : 'message'"
            :type="isReblog ? 'reblog' : 'toot'"
            action="toots.toot.actions.boost"
          />
          <enclosure-toot-content
            :deep-limit="deepLimit"
            :toot="item"
          />
          <enclosure-toot-footer :toot="item" />
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed, toRefs } from 'vue'

const props = defineProps({
  toot: useProp(Object),
  index: useProp(Number),
  deepLimit: useProp(Number, 0)
})

const { toot } = toRefs(props)

const isReblog = computed(() => toot.value.reblog instanceof Object)
const item = computed(() => isReblog.value ? toot.value.reblog : toot.value)
const account = computed(() => isReblog.value ? toot.value.reblog.account : toot.value.account)
const createdAt = computed(() => isReblog.value ? toot.value.reblog.created_at : toot.value.created_at)
const otherAccount = computed(() => isReblog.value ? toot.value.account : null)
</script>
