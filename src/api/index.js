import { $axios } from '@/utils/Axios'
import { apiAuth } from '@/api/auth'
import { apiApp } from '@/api/app'

import { apiAccount } from '@/api/account'
import { apiInstance } from '@/api/instance'
import { apiNotification } from '@/api/notification'
import { apiStatus } from '@/api/status'
import { apiTimeline } from '@/api/timeline'

export const mastoApi = (baseUrl = null, authToken = null) => {
  const setAuthToken = (authToken) => {
    $axios.setToken(authToken, 'Bearer')
  }

  const connect = (baseUrl, authToken = null) => {
    if (!baseUrl) {
      baseUrl = sessionStorage.getItem('baseUrl')
    }

    $axios.setBaseURL(baseUrl)

    if (!authToken) {
      authToken = authToken = sessionStorage.getItem('token')
    }

    if (authToken) {
      setAuthToken(authToken)
    }
    return $axios
  }

  const axios = connect(baseUrl, authToken)

  const { registerApp } = apiApp(axios)

  const {
    fetchAccessToken,
    revokeAccessToken,
    verifyAccountCredentials
  } = apiAuth(axios)

  const {
    account,
    accountBookmarks,
    accountFavourites,
    accountFollowers,
    accountFollowing,
    accountStatuses
  } = apiAccount(axios)

  const {
    getActivity,
    getCustomEmojis,
    getDirectory,
    getInstance,
    getPeers,
    getTrends
  } = apiInstance(axios)

  const {
    notifications
  } = apiNotification(axios)

  const {
    bookmark,
    favourite,
    mute,
    pin,
    reblog,
    unbookmark,
    unfavourite,
    unmute,
    unpin,
    unreblog
  } = apiStatus(axios)

  const {
    timelineConversations,
    timelineFederation,
    timelineHashtag,
    timelineHome,
    timelineList,
    timelineLocal,
    timelinePublic
  } = apiTimeline(axios)

  return {
    connect,

    registerApp,

    fetchAccessToken,
    revokeAccessToken,
    verifyAccountCredentials,

    account,
    accountBookmarks,
    accountFavourites,
    accountFollowers,
    accountFollowing,
    accountStatuses,

    getActivity,
    getCustomEmojis,
    getDirectory,
    getInstance,
    getPeers,
    getTrends,

    notifications,

    bookmark,
    favourite,
    mute,
    pin,
    reblog,
    unbookmark,
    unfavourite,
    unmute,
    unpin,
    unreblog,

    timelineConversations,
    timelineFederation,
    timelineHashtag,
    timelineHome,
    timelineList,
    timelineLocal,
    timelinePublic
  }
}
