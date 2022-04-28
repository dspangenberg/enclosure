<template>
  <div class="flex-1 flex content-between items-center">
    <div class="flex-shrink-0 items-center">
      <div class="absolute inset-y-0 right-0 flex items-center px-4 font-semibold text-base sm:static sm:inset-auto space-x-4">
        enclosure
      </div>
    </div>
    <div class="flex-1 flex items-center space-x-2 h-full" />
    <div class="flex-shrink-0 items-center">
      <div class="absolute inset-y-0 right-0 flex items-center px-4 text-base sm:static sm:inset-auto space-x-3">
        <TheAppHeaderUserMenu />
      </div>
    </div>
  </div>
</template>
<script setup>
import TheAppHeaderUserMenu from './TheAppHeaderUserMenu.vue'
</script>
