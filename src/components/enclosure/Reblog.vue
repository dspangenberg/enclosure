<template>
  <div class="flex flex-col">
    <div class="">
      <enclosure-toot-action-header
        :account="toot.account"
        icon="message-2-share"
        action="toots.toot.actions.boost"
      />
      <div class="min-w-0 flex-1">
        <div>
          <enclosure-toot-header
            :account="reblog.account"
            :created-at="reblog.created_at"
          />
          <enclosure-toot-content :content="reblog.content" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-v-html */
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  toot: useProp(Object)
})

const reblog = computed(() => props.toot.reblog || {})
const account = computed(() => reblog.value?.account || {})

</script>
