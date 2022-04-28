<template>
  <Menu
    as="div"
    class="relative inline-block text-left z-10"
  >
    <MenuButton
      :class="getButtonClass"
      class="inline-flex items-center "
    >
      <slot name="button">
        <stormy-icon
          :name="icon"
          class="text-neutral-900"
          :class="getIconSize"
        />
        <span v-if="label">
          {{ label }}
        </span>
      </slot>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5  focus:outline-none">
        <div class="my-0.5 divide-y divide-gray-100 ">
          <slot />
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { useButton } from '@/composables/useButton.js'
import { useProp } from '@/composables/useProp.js'

const props = defineProps({
  icon: useProp(String, 'dots'),
  label: useProp(String),
  color: useProp(String, 'text-gray-500'),
  button: useProp(Boolean, true),
  iconStrokeWidth: useProp(Number, 1.5),
  iconSize: useProp(String, 'md'),
  iconVariant: useProp(String, 'ghost'),
  iconColor: useProp(String, 'text-gray-500'),
  shortcut: useProp(String, '')
})

const { getIconSize, getClasses } = useButton({
  variant: props.iconVariant,
  size: props.iconSize
})

const getButtonClass = computed(() => props.button ? getClasses : '')

</script>
