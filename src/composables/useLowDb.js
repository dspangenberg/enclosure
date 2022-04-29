import { LowSync, LocalStorage } from 'lowdb'
import { ref, computed } from 'vue'

export function useLowDb () {
  const db = new LowSync(new LocalStorage('enclosure.lowDb'))

  const data = ref(null)
  const dataAccounts = ref(null)

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

    const all = () => dataAccounts
    const first = () => dataAccounts.value[0]
    return { all, first }
  }

  return { readDb, writeDb, accountsCol }
}
