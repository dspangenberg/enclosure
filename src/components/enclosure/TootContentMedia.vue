<template>
  <div class="py-2">
    <vue-easy-lightbox
      scroll-disabled
      move-disabled
      :visible="lightboxVisibile"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      teleport="body"
      @hide="lightboxVisibile = false"
    />

    <ul
      class="grid gap-x-4 gap-y-8 mx-auto relative grid-cols-4"
    >
      <li
        v-for="(medium, index) in props.images"
        :key="medium.id"
        class="block border rounded-md aspect-w-10 aspect-h-7"
      >
        <img
          :src="medium.url"
          class="object-cover border rounded-md border-white w-full cursor-pointer"
          @click="showLigtbox(index)"
        >
      </li>
    </ul>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed, ref } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'

const lightboxIndex = ref(0)
const lightboxVisibile = ref(false)

const lightboxImages = computed(() => props.images.map(item => item.url))

const showLigtbox = index => {
  lightboxIndex.value = index
  lightboxVisibile.value = true
}

const props = defineProps({
  images: useProp(Array)
})

</script>
