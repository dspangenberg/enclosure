import { LowSync, LocalStorage } from 'lowdb'
import { ref, computed, unref, toRaw } from 'vue'
import lodash from 'lodash'

export function useLowDb () {
  const db = new LowSync(new LocalStorage('enclosure.low'))

  const data = ref(null)
  const dataAccounts = ref(null)
  const dataAccount = ref(null)

  const isOpen = ref(false)

  const readDb = () => {
    db.read()
    db.data ||= { accounts: [] }
    isOpen.value = true
    dataAccounts.value = ref(db.data.accounts)
  }

  const writeDb = () => {
    db.data = data.value
    db.write()
  }

  const accountsCol = () => {
    if (!isOpen.value) readDb()

    const accounts = toRaw(dataAccounts.value).value
    const all = () => accounts
    const first = () => {
      dataAccount.value = accounts[0]
      return accounts[0]
    }

    const update = (data) => {
      data.value.accounts[0].username = data.username + 'x'
      writeDb()
    }

    return { all, first, update }
  }

  return { readDb, writeDb, accountsCol }
}
