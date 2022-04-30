<template>
  <div class="text-xxs flex items-center my-1 text-gray-600 ">
    <span class="text-gray-500 mr-0.5">{{ action }}</span>
    <a
      :href="account.url"
      class="hover:underline text-gray-600 font-semibold"
    >
      {{ account.display_name }}
    </a>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n({ useScope: 'global' })

const props = defineProps({
  account: useProp(Object),
  icon: useProp(String, 'message-2-share'),
  action: useProp(String, 'toots.toot.actions.boost')
})

const action = computed(() => $t(props.action))

</script>
