<template>
  <div class="relative not-last:border-b first:rounded-tl-md  first:rounded-tr-md last:rounded-bl-md group last:rounded-br-md border-gray-300/75">
    <div class=" py-2 px-4 h-9 w-full" />
    <div
      v-if="showResult"
      class="absolute top-0 bottom-0 left-0 right-0 group-first:rounded-tl-md group-last:rounded-bl-md border-transparent"
      :class="color"
      :style="barStyle"
    />
    <div class="absolute top-0 bottom-0 left-0 right-0 flex items-center mx-4">
      <div class="flex-shrink-0 w-4">
        <div>
          <stormy-icon
            v-if="checked"
            name="circle-check"
            class="w-4 h-4 text-gray-900"
          />
        </div>
      </div>
      <div
        class="mx-2 flex-1 truncate"
        :class="checked ? 'font-medium text-gray-900' : ''"
      >
        {{ label }}
      </div>
      <div
        v-if="showResult"
        class="flex-shrink-0  text-gray-600 text-xs text-medium"
      >
        {{ percent }} %
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'

const props = defineProps({
  label: useProp(String),
  percent: useProp(Number),
  checked: useProp(Boolean),
  showResult: useProp(Boolean),
  color: useProp(String, 'bg-gray-50')
})

const barStyle = computed(() => {
  return { width: props.percent + '%' }
})

</script>
