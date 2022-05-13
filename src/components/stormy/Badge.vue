<template>
  <span
    class="inline-flex items-center   font-semiblod "
    :class="getClasses"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  color: useProp(String),
  large: useProp(Boolean),
  text: useProp(String, ''),
  border: useProp(Boolean),
  rounded: useProp(Boolean)
})

// Klassen müssten ausgeschrieben sein, sonst werden sie durch den JIT-Kompiler nicht erkennt
// daher kein ${color}-farbe-900 möglich

const colorClasses = computed(() => {
  switch (props.color) {
    case 'red':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'yellow':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    case 'green':
      return 'bg-green-100 border-green-300 text-green-800'
    case 'blue':
      return 'bg-blue-100 border-blue-300 text-blue-800'
    case 'indigo':
      return 'bg-indigo-100 border-indigo-300 text-indigo-800'
    case 'purple':
      return 'bg-purple-100 border-purple-300 text-purple-800'
    case 'pink':
      return 'bg-pink-100 border-pink-300 text-pink-800'
    case 'orange':
      return 'bg-orange-100 border-orange-300 text-orange-800'
    case 'gray':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
})

const getClasses = computed(() => {
  let size = ''
  if (props.rounded === 'rounded') {
    size = props.large === false ? ' px-2 py-0.5 text-xs' : ' px-2.5 py-0.5 text-sm'
  } else {
    size = props.large === false ? ' px-2.5 py-0.5 text-xs' : ' px-3 py-0.5 text-sm'
  }

  const classes = (size + ' ' + colorClasses.value).split(' ')

  classes.push(props.rounded ? 'rounded-full' : 'rounded')

  if (props.border) {
    classes.push('border')
  }

  classes.push(props.rounded)
  return classes
})

</script>
