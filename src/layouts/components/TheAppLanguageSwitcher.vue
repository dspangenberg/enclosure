<template>
  <stormy-menu
    icon="language"
    icon-variant="ghost"
    icon-size="auto"
    :icon-stroke-width="2"
    label="DE"
    label-class="text-gray-400"
    items-class="origin-top-right top-10 right-0 z-50 w-26 "
  >
    <stormy-menu-item
      checked
      label="Deutsch"
      @selected="changeLanguage"
    />
  </stormy-menu>
</template>
<script setup>
import { computed, onMounted } from 'vue'

// const languages = computed(() => langFiles)

const changeLanguage = () => {
  console.log('changes')
}

onMounted(async () => {
  const locales = await import.meta.glob('./locales/*.json')
  console.log(locales)
})

</script>
