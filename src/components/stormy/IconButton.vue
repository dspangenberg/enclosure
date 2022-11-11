<template>
  <component
    :is="getAs"
    ref="button"
    :class="getClasses"
    :disabled="props.disabled"
    :href="props.href ? props.href : null"
    :target="target"
    :type="getType"
    class="flex items-center"
    @click="onClick"
  >
    <stormy-icon
      :name="props.icon"
      :class="getIconSize"
      class="mx-auto"
    />
    <slot />
  </component>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { useButton } from '@/composables/useButton.js'
const emit = defineEmits(['click'])
const button = ref()

// const is = computed(() => props.href === '' ? 'button' : 'Link')

const onClick = (e, e2) => {
  if (!props.href && !props.disabled) {
    button.value.focus()
    emit('click')
  }
}

const props = defineProps({
  icon: useProp(String, '', true),
  target: useProp(String),
  disabled: useProp(Boolean, false),
  variant: useProp(String, 'outline'),
  type: useProp(String, 'button'),
  size: useProp(String, 'md'),
  href: useProp(String, ''),
  as: useProp(String, '')
})

const getAs = computed(() => props.as ? props.as : props.href ? 'a' : 'button')
const getType = computed(() => getAs.value === 'button' ? 'button' : null)
const { getIconSize, getClasses } = useButton(props)
</script>
