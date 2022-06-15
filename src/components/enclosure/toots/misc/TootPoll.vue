<template>
  <div class="pt-4">
    <enclosure-toot-poll-container
      :options="toot.poll.options"
      :own-votes="toot.poll.own_votes"
      :expired="toot.poll.expired"
      :voted="toot.poll.voted"
      :voters="toot.poll.voters_count"
      :remaining-time="remainingTime"
    />
    <div
      v-if="remainingTime && !toot.poll.voted"
      class="py-3 flex items-center"
    >
      <div class="flex-1">
        <button
          :disabled="toot.poll.expired"
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Abstimmen
        </button>
      </div>
      <div class="text-sm px-2">
        {{ toot.poll.voters_count }} Personen
      </div>
      <div class="text-sm">
        <span v-if="remainingTime">
          noch {{ remainingTime }}
        </span>
        <span v-else>
          abgelaufen
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { useProp } from '@/composables/useProp.js'

const { relDate } = useTemplateFilter()
const remainingTime = computed(() => props.toot?.poll.expired !== true ? relDate(props.toot.poll.expires_at, true) : false)

const props = defineProps({
  toot: useProp(Object)
})

</script>
