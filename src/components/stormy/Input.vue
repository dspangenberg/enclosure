<template>
  <div>
    <stormy-label>
      {{ label }}
      <span
        v-if="maxChars"
        class="text-gray-400"
      >
        (max. {{ maxChars }} Zeichen)
      </span>
    </stormy-label>
    <template v-if="type == 'textarea'">
      <textarea
        :disabled="disabled"
        class="w-full text-sm form-textarea font-regular placeholder-gray-400 border border-gray-300 rounded py-1.5 px-1.5 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none "
        :class="[disabled ? 'bg-gray-50' : '']"
        :value="modelValue"
        :rows="rows"
        :name="name"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </template>
    <template v-else>
      <input
        class="w-full text-sm font-regular placeholder-gray-400 border border-gray-300 rounded py-1.5 px-1.5 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none "
        :class="[label ? 'mt-0.5' : '', disabled ? 'bg-gray-50' : '']"
        :disabled="disabled"
        :value="modelValue"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :name="name"
        :type="type"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </template>
    <div class="flex item-center text-xs px-1 py-1.5">
      <div class="flex-1 text-gray-400">
        <slot name="desc" />
      </div>
      <div
        v-if="maxChars"
        class="text-gray-300 text-right"
      >
        {{ modelValue.length }} / {{ maxChars }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineEmits(['update:modelValue'])

defineProps({
  modelValue: useProp([String, Number]),
  type: useProp(String, 'text'),
  name: useProp(String, 'text'),
  autocomplete: useProp(String, 'off'),
  label: useProp(String),
  rows: useProp(Number, 2),
  maxChars: useProp(Number, 0),
  autofocus: useProp(Boolean),
  disabled: useProp(Boolean)
})

</script>
