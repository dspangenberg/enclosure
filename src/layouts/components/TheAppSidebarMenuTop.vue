<template>
  <stormy-nav-group>
    <stormy-nav-item
      name="sidebar.nav.timeline"
      i18n
      active
      exact
      icon="home"
      color="green"
      :count="store.newTootsCount"
      href="/app/timeline/home"
    />
  </stormy-nav-group>

  <stormy-nav-group>
    <stormy-nav-item
      i18n
      href="/app/timeline/profile"
      name="sidebar.nav.my-profile"
      icon="user-circle"
    />
    <stormy-nav-item
      i18n
      href="/app/notifications"
      name="sidebar.nav.notifications"
      icon="notification"
    />
    <stormy-nav-item
      i18n
      disabled
      href="/app/bubble"
      name="sidebar.nav.bubble"
      icon="chart-bubble"
    />
    <stormy-nav-item
      i18n
      href="/app/timeline/conversations"
      name="sidebar.nav.conversations"
      icon="at"
    />
  </stormy-nav-group>

  <stormy-nav-group>
    <stormy-nav-item
      i18n
      href="/app/timeline/favorites"
      name="sidebar.nav.favs"
      icon="heart"
    />
    <stormy-nav-item
      i18n
      href="/app/timeline/bookmarks"
      name="sidebar.nav.bookmarks"
      icon="bookmark"
    />
    <stormy-nav-item
      open
      i18n
      disabled
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
  </stormy-nav-group>
</template>
<script setup>
import { useToots } from '@/stores/toots'

const store = useToots()


</script>