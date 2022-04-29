<template>
  <div
    v-if="errorObj"
    class="rounded-md bg-red-50 p-4 border border-red-200"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <stormy-icon
          name="alert-circle"
          class="text-red-800 h-7 w-7 drop-shadow-lg mx-auto"
        />
      </div>
      <div class="ml-3 mt-1">
        <h3 class="text-large font-semibold text-red-800">
          HTTP-Status {{ statusName }}
        </h3>
        <div class="mt-2 text-sm text-red-700 leading-snug">
          {{ errorObj.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useProp } from '@/composables/useProp.js'
import HttpStatus from '@be/http-status'

const props = defineProps({
  error: useProp(Object)
})

const errorObj = ref(null)

onMounted(() => {
  const { status, data, stack, message } = props.error
  errorObj.value = {
    status,
    stack,
    message,
    error: data.error,
    description: data.error_description
  }
})

const statusName = computed(() => errorObj.value ? new HttpStatus(errorObj.value.status) : '')

</script>
