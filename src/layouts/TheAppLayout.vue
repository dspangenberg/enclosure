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
      <div class="border-gray-100 bg-white flex flex-col w-[36rem] max-w-xl flex-1  justify-between border-l border-r">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <div class="flex-shrink-0 relative w-64 ml-2">
        <div class="fixed">
          xxx
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheAppSidebar from './components/TheAppSidebar.vue'
import TheAppSidebarMenuTop from './components/TheAppSidebarMenuTop.vue'
import TheAppSidebarMenuBottom from './components/TheAppSidebarMenuBottom.vue'

</script>
