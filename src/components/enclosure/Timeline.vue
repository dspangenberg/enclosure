<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <template
      v-if="!storeToots.isLoading"
    >
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="filteredToots.length"
          ref="timelineRef"
          class="flex-1 z-10 pt-12  w-full -mt-1"
        >
          <ul
            role="list"
            class="divide-y divide-gray-200/75"
          >
            <li><slot name="header" /></li>
            <enclosure-toot
              v-for="(toot, index) in filteredToots"
              :key="toot.id"
              :index="index"
              :toot="toot"
            />
            <li
              v-if="storeToots.isLoadingMore"
              class="flex items-center flex-col"
            >
              <div class="text-sm text-gray-400 py-2 px-auto flex items-center">
                <stormy-icon
                  name="refresh"
                  class="w-5 h-5 mr-2 animate-spin-slow"
                  :stroke-width="1"
                />
                <span class="">
                  Weitere Tröts werden geladen
                </span>
              </div>
            </li>
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
    </template>
    <template v-else>
      <div class="w-xl  flex-1 w-xl items-center">
        <div class="flower-spinner mx-auto">
          <div class="dots-container">
            <div class="bigger-dot">
              <div class="smaller-dot" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useToots } from '@/stores/toots'
import { computed, ref } from 'vue'

const storeToots = useToots()

const filteredToots = computed(() => {
  if (['local', 'federation'].includes(props.type)) {
    return storeToots.toots.filter(item => ['de', 'en'].includes(item.language))
  }
  return storeToots.toots
})

const props = defineProps({
  type: useProp(String, '')
})

const timelineRef = ref()

</script>
