<template>
  <div class="border-gray-100 bg-white flex flex-col w-[36rem] max-w-xl flex-1  justify-between border-l border-r">
    <div class="overflow-hidden flex flex-1 max-w-xl h-full relative w-full flex-col">
      <div class="fixed flex-shrink-0 top-0 max-w-xl bg-white z-20 w-[574px]">
        <div class=" text-lg font-bold text-gray-900 flex items-center  border-b border-gray-100">
          <div class="flex-1 my-3 mx-4 ">
            {{ title }}
          </div>
        </div>
      </div>
      <slot />
    </div>
  </div>
  <div class="flex-shrink-0 w-[16rem] flex flex-col max-h-screen ">
    <div class="relative flex flex-1">
      <slot name="aside" />
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

defineProps({
  title: useProp(String, '')
})

</script>
