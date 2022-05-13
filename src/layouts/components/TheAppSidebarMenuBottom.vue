<template>
  <!--
            <stormy-nav-group>
              <stormy-nav-item
                disabled
                i18n
                href="/app/discover"
                name="sidebar.nav.discover"
                icon="timeline"
              />
            </stormy-nav-group>
            -->
  <div>
    <stormy-nav-group>
      <stormy-nav-item
        i18n
        href="/app/timeline/local"
        name="sidebar.nav.local"
        icon="social"
      />
      <stormy-nav-item
        i18n
        href="/app/timeline/federation"
        name="sidebar.nav.federation"
        icon="rocket"
      />
      <!--
            // $t('sidebar.nav.discover')
            // $t('sidebar.nav.favs')
            // $t('sidebar.nav.local')
            // $t('sidebar.nav.federation')
            -->
      <stormy-confirmation-modul
        :show="isRevealed"
        button="Zurücksetzen bestätigen"
        title="Webanwendung zurücksetzen"
        @confirm="confirm"
        @cancel="cancel"
      >
        Möchtest Du die Einstellungen und PouchDb-Datenbank löschen?
      </stormy-confirmation-modul>
    </stormy-nav-group>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useConfirmDialog } from '@vueuse/core'

const route = useRoute()
const isAppMenuOpen = ref(false)

const {
  isRevealed,
  confirm,
  cancel
} = useConfirmDialog()

watch(route, async (route) => { isAppMenuOpen.value = false })

</script>
