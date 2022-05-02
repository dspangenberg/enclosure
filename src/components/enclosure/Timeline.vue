<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <div class="fixed flex-shrink-0 top-0 max-w-xl bg-white z-50  w-[574px]">
      <div class=" text-lg font-bold text-gray-900 flex items-center h-12 border-b border-gray-100">
        <div class="flex-1 my-3 mx-4 ">
          {{ label }}
        </div>
      </div>
    </div>
    <template v-if="!store.isLoading">
      <div class="flex-1 z-10 pt-12  w-full ">
        <ul
          role="list"
          class="divide-y divide-gray-200/75"
        >
          <enclosure-toot
            v-for="(toot, index) in timeline"
            :key="toot.id"
            :index="index"
            :toot="toot"
          />
        </ul>
      </div>
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
import { useStore } from '@/stores/global'
const store = useStore()

defineProps({
  timeline: useProp(Array),
  label: useProp(String, '')
})

</script>
