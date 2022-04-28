<template>
  <div>
    <router-link
      to="/"
      :class="[disabled ? 'text-gray-300 cursor-not-allowed' : isActive ? 'bg-stone-200 hover:bg-blue-50 text-gray-600' : 'text-gray-500 hover:bg-stone-200/50 hover:text-gray-600', 'cursor-pointer group flex items-center px-2 py-1.5 text-sm font-semibold  rounded-md']"
    >
      <stormy-icon
        :name="icon"
        :class="[disabled ? 'text-gray-400' : active ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-900', 'flex-shrink-0 mr-1.5 h-5 w-5 ']"
        :stroke-width="strokeWidth"
      />
      <span class="truncate">
        {{ label }}
      </span>
      <template
        v-if="!disabled && count"
      >
        <stormy-status-dot
          :animate="animate"
          :color="color"
          class="ml-auto text-right mr-4"
        />
      </template>
    </router-link>

    <div
      v-if="!disabled && (active || open)"
      class="text-sm ml-5 my-2 font-normal text-gray-500 space-y-2"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })

const props = defineProps({
  icon: useProp(String),
  href: useProp(String, '#'),
  name: useProp(String),
  color: useProp(String, 'red'),
  disabled: useProp(Boolean),
  active: useProp(Boolean),
  open: useProp(Boolean),
  exact: useProp(Boolean),
  i18n: useProp(Boolean),
  animate: useProp(Boolean),
  count: useProp([Number, String, Boolean], 0),
  strokeWidth: useProp(Number, 2),
  small: useProp(Boolean),
  checked: useProp(Boolean)
})

const label = computed(() => props.i18n ? $t(props.name) : props.name)

const isActive = computed(() => {
  return false
})
</script>
