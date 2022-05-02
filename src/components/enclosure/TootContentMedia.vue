<template>
  <ul
    class="grid gap-x-4 gap-y-8 mx-auto relative grid-cols-4"
  >
    <li
      v-for="medium in props.images"
      :key="medium.id"
      class="block border rounded-md aspect-w-10 aspect-h-7"
    >
      <img
        :src="medium.url"
        class="object-cover border rounded-md border-white w-full"
      >
    </li>
  </ul>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'

const props = defineProps({
  images: useProp(Array)
})

</script>
