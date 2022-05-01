<template>
  <ul
    class="grid gap-x-4 gap-y-8 mx-auto mx-2 relative"
    :class="gridCols"
  >
    <li
      v-for="medium in props.images"
      :key="medium.id"
      class="block border rounded-md aspect-w-10 aspect-h-7"
    >
      <img
        :src="medium.url"
        class="object-cover border rounded-md border-white"
      >
    </li>
  </ul>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import { computed } from 'vue'
const { formatMarkdown } = useTemplateFilter()

const props = defineProps({
  images: useProp(Array)
})

const gridCols = computed(() => props.images.length <= 4 ? `grid-cols-${props.images.length}` : 'grid-cols-4')

</script>
media_attachments
