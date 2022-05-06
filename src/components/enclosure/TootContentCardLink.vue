<template>
  <div
    class="cursor-pointer"
    @click="open"
  >
    <div class="flex flex-1 flex-col border rounded-md">
      <div
        v-if="card.image"
        class="aspect-w-8 aspect-h-4 w-full block"
      >
        <img
          :src="card.image"
          class="object-cover absolute w-full rounded-tl-md rounded-tr-md border-b"
        >
      </div>
      <div class="flex-1 overflow-hidden p-4 my-auto">
        <div class="mb-2">
          <h1 class="text-base font-bold truncate text-blue-700">
            <a
              :href="card.url"
              class="hover:underline"
              target="_blank"
            >
              {{ card.title }}
            </a>
          </h1>
          <stormy-link
            class="text-xs text-gray-700 mt-1"
            :label="card.author_name"
            :link="card.author_url"
            link-class=""
            prefix="von"
            prefix-class="text-gray-500"
            as="div"
          />
        </div>
        <div class="text-sm text-gray-600 text-normal line-clamp-3">
          {{ card.description }}
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
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { computed } from 'vue'

const props = defineProps({
  card: useProp(Object)
})

const open = () => {
  window.open(props.card.url, '_blank')
}

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
