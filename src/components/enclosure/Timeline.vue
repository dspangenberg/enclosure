<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <div
      v-if="storeToots.toots?.length"
      ref="timelineRef"
      class="flex-1 z-10 pt-12  w-full -mt-1"
    >
      <div
        v-if="storeToots.newTootsCount"
        class="text-base text-blue-500 font-semibold text-center p-4 hover:bg-gray-50 border-b"
      >
        <span v-if="storeToots.newTootsCount">
          Neuen Tröt laden
        </span>
        <span v-else>
          {{ storeToots.newTootsCount }} neue Tröts laden
        </span>
      </div>
      <ul
        role="list"
        class="divide-y divide-gray-200/75"
      >
        <enclosure-toot
          v-for="(toot, index) in storeToots.toots"
          :key="toot.id"
          :index="index"
          :toot="toot"
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
