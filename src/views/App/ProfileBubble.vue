<template>
  <enclosure-container
    ref="refTimeline"
    :title="getTitle"
    :is-loading="isLoading"
  >
    <template #default>
      <enclosure-bubble-list
        :me="me"
        :account="account"
        :bubble="people"
      >
        <template
          #header
        >
          <enclosure-profile
            v-if="account"
            :account="account"
          />
        </template>
      </enclosure-bubble-list>
    </template>
    <template #aside>
      {{ route.params }}
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/global'
import Account from '@/models/Account'
import { useMastodon } from '@/composables/useMastodon'
import useEmitter from '@/composables/useEmitter'

const route = useRoute()
const account = ref({})
const me = ref({})
const people = ref([])
const isLoading = ref(true)
const isMounting = ref(true)
const nextPage = ref(null)

const { getFollowers, getFollowing, getAccount } = useMastodon()
const emitter = useEmitter()

const store = useStore()
const mastodonId = computed(() => route?.params?.p || store.getMastodonId())

const getTitle = computed(() => account?.value.username)

watch(route, async (route) => {
  if (isMounting.value) {
    isLoading.value = true
  }
  const result = route.name === 'followers' ? await getFollowers(mastodonId.value, { limit: 40 }) : await getFollowing(mastodonId.value, { limit: 40 })
  people.value = result.data
  nextPage.value = result.next
  isLoading.value = false
  isMounting.value = false
}, { immediate: true })

emitter.on('loadMore', async (e) => await loadMore(e))

const loadMore = async (e) => {
  if (nextPage.value) {
    const result = route.name === 'followers' ? await getFollowers(mastodonId.value, nextPage.value) : await getFollowing(mastodonId.value, nextPage.value)
    people.value.push(...result.data)
    nextPage.value = result.next
  }
}

onMounted(async () => {
  account.value = await getAccount(mastodonId.value)
  console.log(account.value)
  await Account.sync()
})

</script>
