import { getData, queryString } from '@/api/axios'

export const apiAccount = (axios) => {
  const account = async (id) => {
    const result = await axios.get('/accounts/' + id)
    return result.data
  }

  const accountBookmarks = async (options = {}) => {
    const result = await axios.get('/bookmarks?' + queryString.stringify(options))
    return result.data
  }

  const accountFavourites = async (options = {}) => {
    const result = await axios.get('/favourites?' + queryString.stringify(options))
    return result.data
  }

  const accountFollowers = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/followers?' + queryString.stringify(options))
    return result.data
  }

  const accountFollowing = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/following?' + queryString.stringify(options))
    return result.data
  }

  const accountStatuses = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/statuses?' + queryString.stringify(options))
    return result.data
  }

  const accountSuggestions = async (options = {}) => {
    const result = await axios.get('/suggestions?' + queryString.stringify(options))
    return result.data
  }

  /*
    TODO:
    https://docs.joinmastodon.org/methods/accounts/suggestions/ Remove a suggestion
  */

  return {
    account,
    accountBookmarks,
    accountFavourites,
    accountFollowers,
    accountFollowing,
    accountStatuses,
    accountSuggestions
  }
}
