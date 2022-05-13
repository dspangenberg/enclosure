<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <div
      v-if="storeToots.toots?.length"
      ref="timelineRef"
      class="flex-1 z-10 pt-12  w-full -mt-1"
    >
      <div
        v-if="storeToots.newTootsHomeCounter && storeToots.timeline === 'home'"
        class="text-base text-blue-500 font-semibold text-center p-4 hover:bg-gray-50 border-b cursor-pointer"
        @click="storeToots.shiftToots()"
      >
        <span v-if="storeToots.newTootsHomeCounter === 1">
          Neuen Tröt laden
        </span>
        <span v-else>
          {{ storeToots.newTootsHomeCounter }} neue Tröts laden
        </span>
      </div>
      <ul
        role="list"
        class="divide-y divide-gray-100"
      >
        <template v-if="storeToots.timeline === 'profile'">
          <enclosure-profile :account="storeToots.account" />
        </template>
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
import { ref } from 'vue'

const storeToots = useToots()

defineProps({
  type: useProp(String, '')
})

const timelineRef = ref()

</script>
