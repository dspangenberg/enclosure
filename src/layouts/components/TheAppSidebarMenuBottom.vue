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
import PouchDb from '@/models/lib/PouchDb'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores/global'
import { useConfirmDialog, onClickOutside } from '@vueuse/core'

const store = useStore()

const route = useRoute()
const router = useRouter()
const isAppMenuOpen = ref(false)

const {
  isRevealed,
  reveal,
  confirm,
  cancel
} = useConfirmDialog()

const DatebaseTruncate = async () => {
  await PouchDb.db().truncate()
  store.setAccount(null)
  router.push('/auth/login')
}

const onResetApp = async () => {
  const { isCanceled } = await reveal()
  if (!isCanceled) {
    await DatebaseTruncate()
  }
}

watch(route, async (route) => { isAppMenuOpen.value = false })

</script>
