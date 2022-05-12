import { useStore } from '@/stores/global'
import { mastoApi } from '@/api'

const { connect } = mastoApi()

export function useMastodon (connection = null) {
  const getConnection = () => {
    connection = mastoApi()
  }

  getConnection()

  const getNotifications = async (options) => {
    const result = await connection.notifications(options)
    return result
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
    let account
    try {
      if (['accountStatuses', 'timelineHashtag', 'timelineList'].includes(call)) {
        if (call === 'accountStatuses') {
          if (!param) {
            param = await store.getMastodonId()
          }
          account = connection.account(param)
        }
        result = await connection[call](param, options)
      } else {
        result = await connection[call](options)
      }
    } catch (error) {
      return Promise.reject(error)
    }
    result.account = account
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
        return 'accountFavourites'
      case 'bookmarks':
        return 'accountBookmarks'
      case 'profile':
        return 'accountStatuses'
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
    getNotifications,
    getTimeline,
    poll,
    statusAction
  }
}
