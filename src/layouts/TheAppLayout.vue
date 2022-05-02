<template>
  <div class="h-screen overflow-auto flex flex-col w-full bg-white z-10">
    <div class="flex-1 flex container mx-auto w-auto">
      <div class="flex-shrink-0 relative w-64 ">
        <TheAppSidebar class="fixed h-full ">
          <TheAppSidebarMenuTop />
          <template #bottom>
            <TheAppSidebarMenuBottom />
          </template>
        </TheAppSidebar>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import TheAppSidebar from './components/TheAppSidebar.vue'
import TheAppSidebarMenuTop from './components/TheAppSidebarMenuTop.vue'
import TheAppSidebarMenuBottom from './components/TheAppSidebarMenuBottom.vue'

</script>
