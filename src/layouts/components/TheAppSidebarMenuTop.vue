<template>
  <stormy-nav-group>
    <stormy-nav-item
      name="sidebar.nav.timeline"
      i18n
      active
      exact
      icon="home"
      color="green"
      :count="store.newTootsHomeCounter"
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
      href="#"
      name="sidebar.nav.lists"
      icon="list"
    >
      <stormy-sub-nav-item
        v-for="list in lists"
        :key="list.id"
        :name="list.title"
        :href="route(list)"
      />
    </stormy-nav-item>
  </stormy-nav-group>
</template>
<script setup>
import { useToots } from '@/stores/toots'
import { useMastodon } from '@/composables/useMastodon'
import { ref, onMounted } from 'vue'

const store = useToots()
const { getLists } = useMastodon()

const lists = ref([])

const route = (list) => {
  return `/app/timeline/list/${list.id}`
}

onMounted(async () => {
  lists.value = await getLists()
})

</script>
