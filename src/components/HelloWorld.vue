<template>
  <div class="text-center flex-1 border-dotted border border-blue-50 max-w-sm mx-auto p-8 text-base leading-snug">
    <h1 class="font-bold text-lg">
      {{ msg }}
    </h1>

    {{ t('welcome') }}

    <stormy-icon
      name="brand-vue"
      class="text-green-600 h-16 w-16   mx-auto drop-shadow-lg my-6"
    />

    <p>
      Recommended IDE setup:
      <a
        href="https://code.visualstudio.com/"
        class="text-blue-400 hover:underline"
        target="_blank"
      >VS Code</a>
      +
      <a
        href="https://github.com/johnsoncodehk/volar"
        class="text-blue-400 hover:underline"
        target="_blank"
      >Volar</a>
    </p>

    <p>
      <a
        href="https://vitejs.dev/guide/features.html"
        class="text-blue-400 hover:underline"
        target="_blank"
      >
        Vite Documentation
      </a>
      |
      <a
        href="https://v3.vuejs.org/"
        class="text-blue-400 hover:underline"
        target="_blank"
      >Vue 3 Documentation</a>
    </p>

    <button
      type="button"
      class="shadow-sm border border-neutral-300 rounded text-neutral-900 bg-neutral-200 active:border-gray-500 hover:bg-neutral-300 hover:border-neutral-400  ring-offset-white leading-5 mx-auto px-6 m-4 flex py-1"
      @click="count++"
    >
      count is:&nbsp;
      <span class="font-semibold">
        {{ count }}
      </span>
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProp } from '@/composables/useProp.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

defineProps({
  msg: useProp(String)
})

const count = ref(0)
</script>
