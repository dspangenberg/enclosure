<template>
  <div class="h-screen overflow-hidden flex flex-col w-screen bg-white">
    <div class="flex-1 flex w-screen overflow-hidden">
      <TheAppSidebar class="print:hidden print:w-0">
        <TheAppSidebarMenu />
        <template #bottom>
          <stormy-nav-group>
            <stormy-nav-item
              disabled
              i18n
              href="/app/discover"
              name="sidebar.nav.discover"
              icon="timeline"
            />
          </stormy-nav-group>
          <stormy-nav-group>
            <stormy-nav-item
              disabled
              i18n
              href="/app/local"
              name="sidebar.nav.local"
              icon="social"
            />
            <stormy-nav-item
              disabled
              i18n
              href="/app/federation"
              name="sidebar.nav.federation"
              icon="rocket"
            />
          </stormy-nav-group>
          <!--
            // $t('sidebar.nav.discover')
            // $t('sidebar.nav.favs')
            // $t('sidebar.nav.local')
            // $t('sidebar.nav.federation')
            -->
        </template>
      </TheAppSidebar>
      <div class="flex-1 flex flex-col print:flex-shrink-0">
        <div class="flex-shrink-1 bg-stone-50 py-1.5 px-2 print:hidden">
          <TheAppHeader />
        </div>
        <div class="flex-1 overflow-hidden border-gray-100 border-b bg-white flex flex-col justify-between">
          <router-view />
        </div>
      </div>
    </div>
    <div class="flex-shrink-1 bg-gray-100 border-gray-200 border-t print:hidden">
      <TheAppFooter />
    </div>
  </div>
</template>

<script setup>
import TheAppSidebar from './components/TheAppSidebar.vue'
import TheAppSidebarMenu from './components/TheAppSidebarMenu.vue'
import TheAppHeader from './components/TheAppHeader.vue'
import TheAppFooter from './components/TheAppFooter.vue'

</script>
