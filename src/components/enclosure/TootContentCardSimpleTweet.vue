<template>
  <div>
    <div class=" border rounded-md">
      <div class="flex flex-1 items-top">
        <div
          v-if="card.image"
          class="flex-shrink-0 flex items-top pt-3 pl-4 pr-0"
        >
          <img
            :src="card.image"
            class="object-cover rounded-full border-r h-10 w-10"
          >
        </div>
        <div class="p-4">
          <h1 class="text-base font-bold truncate text-blue-700 mb-1">
            <a
              :href="card.url"
              class="hover:underline"
              target="_blank"
            >
              {{ card.title }}
            </a>
          </h1>
          <div class="text-sm text-gray-600 text-normal">
            {{ card.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <stormy-link
    class="p-1 text-xs text-gray-700 mt-1"
    :label="card.provider_name"
    :link="card.provider_url"
    link-class=""
    prefix="via"
    prefix-class="text-gray-500"
    as="div"
  />
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
