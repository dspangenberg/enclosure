import { queryString, processResults } from '@/utils/Axios'

export const apiAccount = (axios) => {
  const block = async (id) => {
    const result = await axios.post(`/accounts/${id}/block`)
    return result.data
  }

  const blockDomain = async (id, domain) => {
    const result = await axios.post('/domain_blocks', { domain })
    return result.data
  }

  const featureTag = async (id, name) => {
    const result = await axios.post('/featured_tags', { name })
    return result.data
  }

  const follow = async (id, reblogs = true, notify = false) => {
    const result = await axios.post(`/accounts/${id}/follow`, {
      reblogs,
      notify
    })

    return result.data
  }

  const muteAccount = async (id, duration = 0, notifications = true) => {
    const result = await axios.post(`/accounts/${id}/mute`, {
      notifications,
      duration
    })

    return result.data
  }

  const note = async (id, comment) => {
    const result = await axios.post(`/accounts/${id}/note`, { comment })
    return result.data
  }

  const pinAccount = async (id) => {
    const result = await axios.post(`/accounts/${id}/pin`)
    return result.data
  }

  const unblock = async (id) => {
    const result = await axios.post(`/accounts/${id}/unblock`)
    return result.data
  }

  const unfollow = async (id) => {
    const result = await axios.post(`/accounts/${id}/unfollow`)
    return result.data
  }

  const unmuteAccount = async (id) => {
    const result = await axios.post(`/accounts/${id}/unmute`)
    return result.data
  }

  const updateCredentials = async (id, data) => {
    const result = await axios.post('/accounts/update_credentials', data)
    return result.data
  }

  const unpinAccount = async (id) => {
    const result = await axios.post(`/accounts/${id}/unpin`)
    return result.data
  }

  const getAccount = async (id) => {
    const result = await axios.get('/accounts/' + id)
    return processResults(result)
  }

  const getBlocks = async (options = {}) => {
    const result = await axios.get('/blocks')
    return processResults(result)
  }

  const getBookmarks = async (options = {}) => {
    const result = await axios.get('/bookmarks?' + queryString.stringify(options))
    return processResults(result)
  }

  const getDomainBlocks = async (options = {}) => {
    const result = await axios.get('/domain_blocks?' + queryString.stringify(options))
    return processResults(result)
  }

  const getEndorsements = async (options = {}) => {
    const result = await axios.get('/endorsements?' + queryString.stringify(options))
    return processResults(result)
  }

  const getFavourites = async (options = {}) => {
    const result = await axios.get('/favourites?' + queryString.stringify(options))
    return processResults(result)
  }

  const getFeaturedTags = async (id) => {
    const result = await axios.get(`/accounts/${id}/featured_tags`)
    return result.data
  }

  const getFollowers = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/followers?' + queryString.stringify(options))
    return processResults(result)
  }

  const getFollowing = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/following?' + queryString.stringify(options))
    return processResults(result)
  }

  const getListsWithAccount = async (id, options = {}) => {
    const result = await axios.get(`/accounts/${id}/lists`)
    return processResults(result)
  }

  const getMutes = async (options = {}) => {
    const result = await axios.get('/mutes')
    return processResults(result)
  }

  const getPreferences = async (options = {}) => {
    const result = await axios.get('/preferences')
    return result.data
  }

  const getProofs = async (id, options = {}) => {
    const result = await axios.get(`/accounts/${id}/identity_proofs`)
    return processResults(result)
  }

  const getRelationships = async (ids, options = {}) => {
    const params = []
    for (const id of ids) {
      params.push(`id[]=${id}`)
    }
    const result = await axios.get('/accounts/relationships?' + params.join('&'))
    return processResults(result)
  }

  const getStatuses = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/statuses?' + queryString.stringify(options))
    return processResults(result)
  }

  const getFeaturedTagsSuggestions = async () => {
    const result = await axios.get('/featured_tags/suggestions')
    return result.data
  }

  const getSuggestions = async (options = {}) => {
    const result = await axios.get('/suggestions?' + queryString.stringify(options))
    return processResults(result)
  }

  /* DELETE */

  const removeBlockDomain = async (id, domain) => {
    const result = await axios.delete('/domain_blocks', { domain })
    return result.data
  }

  const removeFeaturedTag = async (id, name) => {
    const result = await axios.delete(`/featured_tags/${id}`)
    return result.data
  }

  const removeSuggestion = async (id, options = {}) => {
    const result = await axios.delete(`/suggestions/${id}`)
    return processResults(result)
  }

  return {
    block,
    blockDomain,
    featureTag,
    follow,
    muteAccount,
    note,
    pinAccount,
    unblock,
    unfollow,
    unmuteAccount,
    updateCredentials,
    unpinAccount,
    getAccount,
    getBlocks,
    getBookmarks,
    getDomainBlocks,
    getEndorsements,
    getFavourites,
    getFeaturedTags,
    getFeaturedTagsSuggestions,
    getFollowers,
    getFollowing,
    getListsWithAccount,
    getMutes,
    getPreferences,
    getProofs,
    getRelationships,
    getStatuses,
    getSuggestions,
    removeSuggestion,
    removeBlockDomain,
    removeFeaturedTag
  }
}
