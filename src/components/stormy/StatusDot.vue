<template>
  <span
    class="inline-block relative"
    :class="getDynClasses.size"
  >
    <span
      v-if="animate"
      :class="getDynClasses.color"
      class="animate-ping absolute h-full w-full rounded-full opacity-75"
    />
    <span
      :class="getDynClasses.color"
      class="absolute rounded-full h-full w-full"
    />
  </span>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'red'
  },
  animate: {
    type: Boolean,
    default: true
  },
  size: {
    type: Number,
    default: 2
  }
})

const sizes = ['h-1 w-1', 'h-2 w-2', 'h-3 w-3', 'h-4 w-4', 'h-5 w-5']
const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-400', 'bg-orange-400']

const getDynClasses = computed(() => {
  const size = sizes[props.size - 1]
  const color = colors.filter(item => item.includes(props.color))

  return { size, color }
})

</script>
