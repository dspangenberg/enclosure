<template>
  <div>
    <component
      :is="componentIs"
      :to="href"
      class="flex items-center"
      :class="[disabled ? 'text-gray-300 cursor-not-allowed' : isActive ? 'bg-stone-100 hover:bg-blue-50 text-gray-600' : 'text-gray-500 hover:bg-stone-200/50 hover:text-gray-600', 'cursor-pointer group  px-2 py-1.5 text-sm font-semibold  rounded-md']"
      @click="onClick"
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
    </component>

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
import { useRoute } from 'vue-router'

const route = useRoute()
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

const emits = defineEmits(['selected', 'navigate'])

const label = computed(() => props.i18n ? $t(props.name) : props.name)

const componentIs = computed(() => {
  return props.href === '#' ? 'span' : 'router-link'
})

const isActive = computed(() => {
  return (props.href === route.path)
})

const onClick = (event) => {
  if (props.href !== '#') return true
  event.preventDefault()
  emits('selected')
}

</script>
