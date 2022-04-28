<template>
  <MenuItem
    v-slot="{ active }"
    :disabled="disabled"
  >
    <a
      :href="href"
      :disabled="disabled"
      :class="[active ? 'bg-gray-100' : '', small ? 'text-xs px-2 py-2' : 'text-sm px-2 py-1.5', danger ? 'hover:bg-red-100 hover:text-red-600' : 'hover:bg-gray-100', disabled ? 'text-gray-300' : 'text-gray-700', 'w-full flex items-center rounded-sm']"
    >
      <div class="flex-shrink-0 items-center">
        <div :class="[small ? 'w-5' : 'w-7']">
          <stormy-icon
            v-if="icon || checked"
            :name="getIcon"
            :class="[small ? 'w-4 h-4' : 'w-5 h-5', checked ? 'text-blue-500' : '', danger ? 'hover:text-red-600' : '']"
          />
        </div>
      </div>
      <div class="flex-1 text-left font-normal">
        {{ label }}
      </div>
      <div class="flex-shrink-0 items-center">
        <slot name="shortcut">
          <span class="ml-auto pl-3 flex-none text-sm text-gray-400 font-normal">
            {{ shortcut }}
          </span>
        </slot>
      </div>
    </a>
  </MenuItem>
</template>
<script setup>
import { MenuItem } from '@headlessui/vue'
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// $t wg. vue-i18n-extract; aber funktioniert bei dynamischen Strings (props.label) nicht
const { t: $t } = useI18n({ useScope: 'global' })

const props = defineProps({
  icon: useProp(String),
  href: useProp(String, '#'),
  label: useProp(String),
  shortcut: useProp([String, Number]),
  disabled: useProp(Boolean),
  i18n: useProp(Boolean),
  danger: useProp(Boolean),
  small: useProp(Boolean),
  checked: useProp(Boolean, false)
})

const label = computed(() => props.i18n ? $t(props.label) : props.label)

const getIcon = computed(() => {
  return props.checked === true ? 'tabler-check' : props.icon
})

</script>
