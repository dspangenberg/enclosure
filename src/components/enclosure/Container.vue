<template>
  <div class="border-gray-100 bg-white flex flex-1 justify-between relative ">
    <div class="overflow-hidden flex flex-1  h-full relative  border-l w-[574px] border-r border-gray-100">
      <div class="fixed z-10  top-0  bg-white h-12 mb-12 border-b w-[572px] flex flex-1 items-center border-gray-100">
        <div class="mx-4 text-lg font-bold flex-1">
          {{ getTitle }}
        </div>
        <div class="mx-4 text-lg font-bold">
          <slot name="title-right" />
        </div>
      </div>
      <div
        class="flex-1  bg-white z-0 w-[574px] flex items-center"
        :class="isLoading ? 'items-center' : 'items-start'"
      >
        <template v-if="isLoading">
          <div class=" flex-1 w-[574px]  items-center ">
            <div class="flower-spinner mx-auto">
              <div class="dots-container">
                <div class="bigger-dot">
                  <div class="smaller-dot" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex-1 flex h-full items-start">
            <slot />
          </div>
        </template>
      </div>
    </div>
    <div class="flex-shrink-0 w-[16rem] flex overflow-y-hidden relative flex-col bg-stone-50 border-stone-200 border-r">
      <div class="flex flex-1 fixed h-screen flex-col">
        <div class="flex-1">
          <slot name="aside" />
        </div>
        <div class="flex-shrink-0 p-3 text-sm text-gray-400">
          bleeply
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n({ useScope: 'global' })

const props = defineProps({
  title: useProp(String, ''),
  isLoading: useProp(Boolean),
  i18n: useProp(Boolean)
})

const getTitle = computed(() => props.i18n ? $t(props.title) : props.title)

</script>
