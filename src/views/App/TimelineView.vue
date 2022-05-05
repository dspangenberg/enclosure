<template>
  <enclosure-container>
    <template #default>
      <enclosure-timeline
        :type="timelineType"
      />
    </template>
    <template #aside>
      <enclosure-trends />
      <enclosure-suggestions />
    </template>
  </enclosure-container>
</template>
<script setup>
import { watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToots } from '@/stores/toots'
import { useStore } from '@/stores/global'
import { useProp } from '@/composables/useProp.js'
import { firstAccount } from '@/utils/db.js'

import PouchDb from '@/models/lib/PouchDb'
import Account from '@/models/Account'

const store = useToots()
const route = useRoute()
const global = useStore()

defineProps({
  title: useProp(String, 'Timeline ohne Name')
})

watch(route, async (route) => {
  console.log(route?.params?.tag)
  await store.getTootsforTimeline(route?.params?.type || 'home', {}, null, route?.params?.tag || null)
}, { immediate: true })

const timelineType = computed(() => route?.params?.type || 'home')

onMounted(async () => {
  const db = new PouchDb()

  const accounts = await Account.db().find()
  console.log('accounts', accounts)

  const account = await Account.db().first()
  console.log('account', account)

/*
  const account = new Account(accountData)
  console.log(account)

  account.acct = 'katze'
  await account.save()
  console.log(account)

  const all = await db.$pouch.allDocs({ include_docs: true })
  console.log('all', all)
*/
  /*
  const all = await db.$pouch.allDocs({ include_docs: true })
  console.log('all', all)
  const account = await Account.db().first()
  console.log(account)
/*
    const oldAccount = await firstAccount()
    console.log(oldAccount)

    delete oldAccount.id

    const account = new Account(oldAccount)
    // await account.save()
    console.log(account)

  const db = new PouchDb()
  const len = await db.bulkRemoveByDocType('account')
  console.log(len)

  const accounts = await Account.db().find()
  console.log(accounts)

/*

  // const all = await db.$pouch.allDocs({ include_docs: true })
  // console.log(all)

  let ids = await db.getAllIds(true)
  console.log('****', ids)

  const records = await db.getAllByIds(ids)
  if (records && records.length) {
    for (const doc of records) {
      await db.remove(doc)
    }
  }

  ids = await db.getAllIds(true)
  console.log('****', ids)
  */
})

</script>
