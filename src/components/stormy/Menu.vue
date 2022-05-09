<template>
  <Menu
    as="div"
    class="relative text-left z-10"
    :class="menuClass"
  >
    <MenuButton
      class="items-center flex"
      :class="getButtonClass"
    >
      <slot name="button">
        <stormy-icon
          :name="icon"
          class="text-gray-500 flex-shrink-0 w-5 h-5 ml-2"
          :class="getIconSize"
          :stroke-width="iconStrokeWidth"
        />
        <span
          v-if="label"
          class="flex-1 w-auto ml-0.5 mr-2"
          :class="labelClass"
        >
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
      <MenuItems
        class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5  focus:outline-none absolute"
        :class="itemsClass"
      >
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
  shortcut: useProp(String, ''),
  menuClass: useProp(String, 'inline-block '),
  buttonClass: useProp(String, 'inline-flex'),
  labelClass: useProp(String, ''),
  itemsClass: useProp(String, 'origin-bottom-right  bottom-12 left-12 z-50 w-56')
})

const { getIconSize, getClasses } = useButton({
  variant: props.iconVariant,
  size: props.iconSize
})

const getButtonClass = computed(() => props.button ? getClasses.value : props.buttonClass)
</script>
