<template>
  <li class="">
    <div class=" pb-8 ">
      <div class="relative flex items-start ">
        <div class="min-w-0 flex-1 text-base shadow-md border rounded-md">
          <enclosure-toot-avatar
            :account="account"
            :other-account="otherAccount"
          />
          <div class="min-w-0 flex-1">
            <div class="p-2">
              <enclosure-toot-header
                :account="account"
                :created-at="createdAt"
                :other-account="otherAccount"
                :type="isReblog ? 'reblog' : 'toot'"
                :icon="isReblog ? 'message-2-share' : 'message'"
                action="toots.toot.actions.boost"
              />
              <enclosure-toot-content :content="content" />
            </div>
            <enclosure-toot-footer :item="item" />
          </div>
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

const item = computed(() => isReblog.value ? props.toot.reblog : props.toot)
const account = computed(() => isReblog.value ? props.toot.reblog.account : props.toot.account)
const content = computed(() => isReblog.value ? props.toot.reblog.content : props.toot.content)
const createdAt = computed(() => isReblog.value ? props.toot.reblog.created_at : props.toot.created_at)
const otherAccount = computed(() => isReblog.value ? props.toot.account : null)
</script>
