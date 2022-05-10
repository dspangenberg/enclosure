import { $axios } from './axios'
import { apiAuth } from '@/api/auth'
import { apiApp } from '@/api/app'

import { apiAccount } from '@/api/account'
import { apiInstance } from '@/api/instance'
import { apiNotification } from '@/api/notification'
import { apiTimeline } from '@/api/timeline'

export const mastoApi = (baseUrl = null, authToken = null) => {
  const setAuthToken = (authToken) => {
    $axios.setToken(authToken, 'Bearer')
  }

  const connect = (baseUrl, authToken = null) => {
    $axios.setBaseURL(baseUrl)
    if (authToken) {
      setAuthToken(authToken)
    }
    return $axios
  }

  const axios = connect(baseUrl, authToken)

  const { registerApp } = apiApp(axios)

  const {
    fetchAccessToken,
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
    activity,
    customEmojis,
    directory,
    instance,
    peers,
    trends
  } = apiInstance(axios)

  const {
    notifications
  } = apiNotification(axios)

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
    verifyAccountCredentials,

    account,
    accountBookmarks,
    accountFavourites,
    accountFollowers,
    accountFollowing,
    accountStatuses,

    activity,
    customEmojis,
    directory,
    instance,
    peers,
    trends,

    notifications,

    timelineConversations,
    timelineFederation,
    timelineHashtag,
    timelineHome,
    timelineList,
    timelineLocal,
    timelinePublic
  }
}
