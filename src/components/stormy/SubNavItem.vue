<template>
  <div>
    <component
      :is="componentIs"
      :class="[disabled ? 'text-gray-300 !cursor-not-allowed' : active ? 'font-regular' : 'text-gray-500 hover:underline', 'rounded focus:border-blue-400 focus:ring-1 focus:ring-blue-200 focus:outline-none cursor-pointer group flex items-center px-3.5 py-2rounded-md']"
      :aria-current="active ? 'page' : undefined"
      :to="href"
      @click="onClick"
    >
      <span class="truncate hover:underline">
        {{ label }}
      </span>
      <span
        v-if="!disabled && badge"
        class="ml-auto text-right font-normal text-sm"
      >
        {{ badge }}
      </span>
    </component>
    <div :class="[withSep ? 'space-y-1 border-b border-gray-100 pb-2 ml-3' : '']" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n({ useScope: 'global' })
const emits = defineEmits(['selected'])

const props = defineProps({
  href: useProp(String, '#'),
  name: useProp(String),
  badgeColor: useProp(String, 'red'),
  disabled: useProp(Boolean),
  active: useProp(Boolean),
  i18n: useProp(Boolean),
  badgeAnimate: useProp(Boolean),
  badge: useProp(Number || String || Boolean),
  strokeWidth: useProp(Boolean),
  small: useProp(Boolean),
  withSep: useProp(Boolean)
})

const componentIs = computed(() => {
  return props.href === '#' ? 'span' : 'router-link'
})

const label = computed(() => props.i18n ? $t(props.name) : props.name)

const onClick = (event) => {
  if (props.href !== '#') return true
  event.preventDefault()
  emits('selected')
}

</script>
