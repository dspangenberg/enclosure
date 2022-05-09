<template>
  <MenuItem
    v-slot="{ active }"
    :disabled="disabled"
    @click="onMenuClicked"
  >
    <div
      :disabled="disabled"
      :class="[active ? 'bg-gray-100' : '', props.small ? 'text-xs px-2 py-1.5' : 'text-sm px-2 py-2', props.danger && !props.disabled ? 'hover:bg-red-100 hover:text-red-600' : '', disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 cursor-pointer', 'w-full select-none flex items-center rounded-sm']"
    >
      <div class="flex-shrink-0 items-center">
        <div :class="[props.small ? 'w-5' : 'w-7']">
          <stormy-icon
            v-if="props.icon || props.checked"
            :name="getIcon"
            :class="[props.small ? 'w-4 h-4' : 'w-5 h-5', props.checked ? 'text-blue-500' : '', props.danger ? 'hover:text-red-600' : '']"
          />
        </div>
      </div>
      <div class="flex-1 text-left font-normal">
        <slot>
          {{ props.label }}
        </slot>
      </div>
      <div class="flex-shrink-0 items-center">
        <slot name="shortcut">
          <span class="ml-auto pl-3 flex-none text-sm text-gray-400 font-normal">
            {{ props.shortcut }}
          </span>
        </slot>
      </div>
    </div>
  </MenuItem>
</template>
<script setup>
import { MenuItem } from '@headlessui/vue'
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const emit = defineEmits(['selected'])

const props = defineProps({
  icon: useProp(String),
  href: useProp(String),
  label: useProp(String),
  shortcut: useProp([String, Number]),
  disabled: useProp(Boolean),
  danger: useProp(Boolean),
  small: useProp(Boolean),
  checked: useProp(Boolean, false)
})

const getIcon = computed(() => {
  console.log(props.checked)
  return props.checked === true ? 'check' : props.icon
})

const onMenuClicked = () => {
  if (!props.disabled) {
    if (props.href) {
      window.location = props.href
    } else {
      emit('selected')
    }
  }
}

</script>
