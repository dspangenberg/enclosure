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
