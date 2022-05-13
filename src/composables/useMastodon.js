import { useStore } from '@/stores/global'
import { mastoApi } from '@/api'
import { sortBy, reverse, omit } from 'lodash'
import uniqueRandom from 'unique-random'

export function useMastodon (connection = null) {
  const getConnectionParameters = () => {
    connection = mastoApi()
  }

  getConnectionParameters()

  const getAccount = async (id, query) => {
    query.pinned = false
    const result = await connection.getAccount(id)
    const rel = await getRelationships([result.data])
    const pinned = await connection.getStatuses(id, { pinned: true })
    const statuses = await connection.getStatuses(id, query)
    result.data = rel[0]
    result.data.statuses = []
    result.data.statuses.push(...pinned.data)
    result.data.statuses.push(...statuses.data)
    result.data.statuses.next = statuses.next
    return result.data
  }

  const follow = async (id) => {
    const result = await connection.follow(id)
    return result.data
  }

  const getLists = async (options) => {
    const result = await connection.getLists(options)
    return result.data
  }

  const getNotifications = async (options) => {
    const result = await connection.notifications(options)
    return result
  }

  const getThread = async (id) => {
    const thread = []
    const status = await connection.getStatus(id)
    const result = await connection.getThread(id)

    status.data.isKingOfThread = true

    thread.push(...result.data.ancestors)
    thread.push(status.data)
    thread.push(...result.data.descendants)
    return thread
  }

  const removeSuggestion = async (id) => {
    await connection.removeSuggestion(id)
    const suggestion = await getSuggestions(1)
    return suggestion[0]
  }

  const getSuggestions = async (limit = 5, options) => {
    const result = await connection.getSuggestions({ limit: 20 })
    const random = uniqueRandom(0, result.data.length - 1)
    const suggestions = []
    for (let index = 0; index < limit; index++) {
      const suggestion = result.data[random()]
      suggestion.blink = false
      suggestions.push(suggestion)
    }
    return suggestions
  }

  const getRelationships = async (data) => {
    const store = useStore()

    const ids = data.map(item => item.id)
    const rels = await connection.getRelationships(ids)
    const people = []
    for (let account of data) {
      const rel = rels.data.find(item => item.id === account.id)
      if (rel !== undefined) {
        rel.my_note = rel?.note
        rel.isMe = store.getMastodonId() === account.id

        delete rel.note
        account = Object.assign(account, rel)
      }
      people.push(account)
    }
    return people
  }

  const getFollowers = async (id, options) => {
    const result = await connection.getFollowers(id, options)
    result.data = await getRelationships(result.data)
    return result
  }

  const getFollowing = async (id, options) => {
    const result = await connection.getFollowing(id, options)
    result.data = await getRelationships(result.data)
    return result
  }

  const getTrends = async (options) => {
    const result = await connection.getTrends({ limit: 20 })

    let items = result.data.map(item => {
      item.history = item.history.map(item => {
        item.accounts = parseInt(item.accounts)
        item.uses = parseInt(item.uses)
        return item
      })
      return item
    })
    items = items.map(item => {
      return {
        name: item.name,
        accounts: item.history[0].accounts + item.history[1].accounts,
        uses: item.history[0].uses + item.history[1].uses
      }
    })
    // items = items.map(item => { return { name: item.name, accounts: sumBy(item.history, 'accounts'), uses: sumBy(item.history, 'uses') } })
    return reverse(sortBy(items, ['uses']))
  }

  const poll = async (id, choices) => {
    if (!Array.isArray(choices)) {
      choices = [choices]
    }
    const result = await connection.poll(id, choices)
    return result.data
  }

  const statusAction = async (toot, action) => {
    let { call, key } = getStatusActionCall(action)

    if (toot[key]) {
      call = 'un' + call
    }

    const result = await connection[call](toot.id)
    if (call === 'reblog') {
      result.data = result.data.reblog
      result.data.reblog = null
    }
    return result.data
  }

  const getTimeline = async (type, param = null, options = {}) => {
    const store = useStore()
    const call = getTimelineCall(type)
    let result
    let account = null
    let list = null
    try {
      if (['getStatuses', 'timelineHashtag', 'timelineList'].includes(call)) {
        if (call === 'timelineList') {
          list = await connection.getList(param)
        }
        if (call === 'getStatuses') {
          if (!param) {
            try {
              param = store.getMastodonId()
            } catch (error) {
              console.log(error)
            }
          }
          account = await getAccount(param, options)
          result = {
            data: account.statuses,
            next: account.statuses.next,
            account: omit(account, ['statuses']),
            list: list || null
          }
          return Promise.resolve(result)
        }
        result = await connection[call](param, options)
      } else {
        result = await connection[call](options)
      }
    } catch (error) {
      return Promise.reject(error)
    }
    result.account = account || null
    result.list = list?.data || null
    return Promise.resolve(result)
  }

  const getStatusActionCall = (type) => {
    switch (type) {
      case 'bookmark':
        return {
          call: 'bookmark',
          key: 'bookmarked'
        }
      case 'favourite':
        return {
          call: 'favourite',
          key: 'favourited'
        }
      case 'mute':
        return {
          call: 'mute',
          key: 'muted'
        }
      case 'pin':
        return {
          call: 'pin',
          key: 'pinned'
        }
      case 'reblog':
        return {
          call: 'reblog',
          key: 'reblogged'
        }
    }
  }

  const getTimelineCall = (type) => {
    switch (type) {
      case 'favorites':
        return 'getFavourites'
      case 'bookmarks':
        return 'getBookmarks'
      case 'profile':
        return 'getStatuses'
      case 'local':
        return 'timelineLocal'
      case 'federation':
        return 'timelineFederation'
      case 'conversations':
        return 'timelineConversations'
      case 'tags':
        return 'timelineHashtag'
      case 'list':
        return 'timelineList'
      case 'home':
      default:
        return 'timelineHome'
    }
  }

  return {
    follow,
    getAccount,
    getFollowers,
    getFollowing,
    getLists,
    getNotifications,
    getSuggestions,
    getThread,
    getTimeline,
    getTrends,
    poll,
    removeSuggestion,
    statusAction
  }
}
