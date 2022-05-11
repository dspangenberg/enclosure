import { queryString, processResults } from '@/utils/Axios'

export const apiAccount = (axios) => {
  const account = async (id) => {
    const result = await axios.get('/accounts/' + id)
    return processResults(result)
  }

  const accountBookmarks = async (options = {}) => {
    const result = await axios.get('/bookmarks?' + queryString.stringify(options))
    return processResults(result)
  }

  const accountFavourites = async (options = {}) => {
    const result = await axios.get('/favourites?' + queryString.stringify(options))
    return processResults(result)
  }

  const accountFollowers = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/followers?' + queryString.stringify(options))
    return processResults(result)
  }

  const accountFollowing = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/following?' + queryString.stringify(options))
    return processResults(result)
  }

  const accountStatuses = async (id, options = {}) => {
    const result = await axios.get('/accounts/' + id + '/statuses?' + queryString.stringify(options))
    return processResults(result)
  }

  const accountSuggestions = async (options = {}) => {
    const result = await axios.get('/suggestions?' + queryString.stringify(options))
    return processResults(result)
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
