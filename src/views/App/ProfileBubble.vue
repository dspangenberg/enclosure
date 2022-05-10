<template>
  <enclosure-container
    ref="refTimeline"
    :title="getTitle"
  >
    <template #default>
      <enclosure-bubble-list
        :me="me"
        :account="account"
        :bubble="bubble"
      >
        <template
          #header
        >
          <enclosure-profile :account="store.account" />
        </template>
      </enclosure-bubble-list>
    </template>
    <template #aside>
      Na, Hi erst einmal
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToots } from '@/stores/toots'
import useEmitter from '@/composables/useEmitter'
import { useI18n } from 'vue-i18n'
import Account from '@/models/Account'
import { intersection } from 'lodash'

const route = useRoute()
const type = route?.params?.type
const account = ref({})
const me = ref({})

const { t: $t } = useI18n({ useScope: 'global' })
const emitter = useEmitter()

const store = useToots()

const bubble = computed(() => route?.params?.type === 'follower' ? account.value.follower : account.value.following)
const getTitle = computed(() => account?.value.username)
const accountId = computed(() => route?.params?.p)

onMounted(async () => {
  // me.value = await Account.me()
  // account.value = await getAccount(accountId.value, true)
  // console.log(account.value)
})

</script>
