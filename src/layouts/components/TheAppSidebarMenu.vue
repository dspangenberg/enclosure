<template>
  <stormy-nav-group>
    <stormy-nav-item
      name="sidebar.nav.timeline"
      i18n
      active
      exact
      icon="home"
      color="green"
      count="2"
      href="/app/home"
    />
  </stormy-nav-group>

  <!--
    Mehr als 7, nix gut => besser in Header
  <stormy-nav-group>
    <stormy-nav-item
      href="/contacts"
      name="Mitteilungen"
      icon="notification"
    />
    <stormy-nav-item
      href="/projects"
      name="Nachrichten"
      icon="mail"
    />
  </stormy-nav-group>
  -->

  <stormy-nav-group>
    <stormy-nav-item
      i18n
      href="/app/favorites"
      name="sidebar.nav.favs"
      icon="heart"
    />
    <stormy-nav-item
      i18n
      href="/app/bookmarks"
      name="sidebar.nav.bookmarks"
      icon="bookmark"
    />
    <stormy-nav-item
      open
      i18n
      href="#"
      name="sidebar.nav.lists"
      icon="list"
    >
      <stormy-sub-nav-item
        :disabled="true"
        name="Nachrichten"
      />
      <stormy-sub-nav-item
        :disabled="true"
        name="Webentwicklung"
      />
      <stormy-sub-nav-item
        :disabled="true"
        name="Klatsch"
      />
    </stormy-nav-item>
    <stormy-nav-item
      disabled
      i18n
      href="/app/my/hashs"
      name="sidebar.nav.tags"
      icon="hash"
    />
  </stormy-nav-group>
  <!--
      // $t('sidebar.nav.timeline')
      // $t('sidebar.nav.favs')
      // $t('sidebar.nav.bookmarks')
      // $t('sidebar.nav.lists')
      // $t('sidebar.nav.tags')
    -->
</template>
