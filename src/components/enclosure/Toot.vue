<template>
  <li>
    <enclosure-toot-reblog-info
      :account="account"
      :created-at="createdAt"
      :other-account="otherAccount"
      :icon="isReblog ? 'message-2-share' : 'message'"
      :type="isReblog ? 'reblog' : 'toot'"
      action="toots.toot.actions.boost"
    />
    <div class="relative flex items-start ">
      <div
        class="min-w-0 flex-1 text-base shadow-sm rounded-md border border-gray-200"
      >
        <div class="min-w-0 flex-1">
          <div class="">
            <enclosure-toot-header
              :account="account"
              :created-at="createdAt"
              :other-account="otherAccount"
              :icon="isReblog ? 'message-2-share' : 'message'"
              :type="isReblog ? 'reblog' : 'toot'"
              action="toots.toot.actions.boost"
            />
            <enclosure-toot-content :toot="toot" />
          </div>
          <enclosure-toot-sys-info
            class="border-t p-2"
            :account="account"
            :toot="toot"
          />
          <enclosure-toot-footer :toot="toot" />
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  toot: useProp(Object)
})

const isReblog = computed(() => props.toot.reblog instanceof Object)

const toot = computed(() => isReblog.value ? props.toot.reblog : props.toot)
const account = computed(() => isReblog.value ? props.toot.reblog.account : props.toot.account)
const createdAt = computed(() => isReblog.value ? props.toot.reblog.created_at : props.toot.created_at)
const otherAccount = computed(() => isReblog.value ? props.toot.account : null)
</script>
