<template>
  <div>
    <div class="flex flex-1 border rounded-md shadow-sm">
      <div v-if="card.image">
        <img
          :src="card.image"
          class="object-cover w-28 h-28 rounded-tl-md rounded-bl-md"
        >
      </div>
      <div class="flex-1 overflow-hidden p-2 my-auto">
        <h1 class="text-base font-semibold mb-2 truncate text-blue-700">
          <a
            :href="card.url"
            class="hover:underline"
            target="_blank"
          >
            {{ card.title }}
          </a>
        </h1>
        <div class="text-sm text-gray-600 text-normal line-clamp-3">
          {{ card.description }}
        </div>
      </div>
    </div>
    <div class="text-xxs text-gray-400  my-0.5 px-1 leading-normal flex items-center">
      <stormy-icon
        name="external-link"
        class="w-4 h-4 text-gray-500 mr-0.5"
      />

      <div class="flex-1 truncate">
        {{ card.url }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  card: useProp(Object)
})

const styles = computed(() => {
  return {
    width: props.card.width + 'px',
    height: props.card.height + 'px'
  }
})

/*
{
    "url": "https://de.wikipedia.org/wiki/Le_nozze_di_Figaro",
    "title": "Le nozze di Figaro – Wikipedia",
    "description": "",
    "type": "link",
    "author_name": "",
    "author_url": "",
    "provider_name": "",
    "provider_url": "",
    "html": "",
    "width": 400,
    "height": 318,
    "image": "https://files.mastodon.social/cache/preview_cards/images/041/397/229/original/40004a2845399018.jpg",
    "embed_url": "",
    "blurhash": "U7K,,7?c~psn4-ad%2t7I9WAE1s:t6WCofs:"
}
*/
</script>
