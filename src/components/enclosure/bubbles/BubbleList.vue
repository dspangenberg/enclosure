<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="bubble.length"
        ref="timelineRef"
        class="flex-1 z-10 pt-12  w-full -mt-1"
      >
        <ul
          role="list"
          class="divide-y divide-gray-200/75"
        >
          <li><slot name="header" /></li>
          <enclosure-bubble-list-item
            v-for="(person, index) in bubble"
            :key="person.id"
            :index="index"
            :me="me"
            :account="account"
            :person="person"
          />
        </ul>
      </div>
      <div
        v-else
        class="w-xl flex-1 w-xl items-center"
      >
        <stormy-icon
          name="mood-empty"
          class="text-gray-300 mx-auto drop-shadow-xl w-20 h-20"
        />
        <div class="relative p-8 text-center">
          <h2 class="text-2xl font-medium">
            There's nothing here...
          </h2>
          <p class="mt-4 text-sm text-gray-500">
            Created posts will appear here, try creating one!
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { ref } from 'vue'

defineProps({
  me: useProp(Object),
  account: useProp(Object),
  bubble: useProp(Array)
})

const timelineRef = ref()

</script>
