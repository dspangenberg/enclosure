<template>
  <div class="border rounded-md text-sm border-gray-300/75">
    <enclosure-toot-poll-option
      v-for="(option, index) in options"
      :key="index"
      :label="option.title"
      :checked="checked(index)"
      :percent="percentage(option)"
      :color="colors[index]"
      :show-result="showResult"
    />
  </div>
  <div class="py-2 px-10 text-xs text-gray-400 flex">
    <span>
      {{ formatInt(voters) }} Teilnehmende
    </span>
    <span v-if="expired && !voted">
      &nbsp;&mdash;&nbsp;Du hast nicht teilgenommen.
    </span>
    <span v-if="voted && !expired">
      &nbsp;&mdash;&nbsp; noch {{ remainingTime }}
    </span>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { sumBy } from 'lodash'
import { useTemplateFilter } from '@/composables/useTemplateFilter'

const { formatInt } = useTemplateFilter()

const props = defineProps({
  options: useProp(Array),
  ownVotes: useProp(Array),
  expired: useProp(Boolean),
  voters: useProp(Number),
  remainingTime: useProp([String, Boolean]),
  voted: useProp(Boolean)
})

const colors = ['bg-blue-100', 'bg-red-100', 'bg-green-100', 'bg-yellow-100', 'bg-orange-100']

const coreValue = computed(() => sumBy(props.options, 'votes_count'))

const showResult = computed(() => props.expired || props.voted)

const percentage = (option) => {
  return Math.round(option.votes_count / coreValue.value * 100)
}

const checked = (index) => {
  return props.ownVotes.includes(index)
}

</script>
