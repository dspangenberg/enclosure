import { getData, queryString } from '@/utils/Axios'

export const apiInstance = (axios) => {
  const getActivity = async () => {
    const result = await axios.get('/instance/activity')
    return result.data
  }

  const getCustomEmojis = async () => {
    const result = await axios.get('/custom_emojis')
    return result.data
  }

  const getDirectory = async (options = {}) => {
    const result = await axios.get('/directory?' + queryString.stringify(options))
    return result.data
  }

  const getInstance = async () => {
    const result = await axios.get('/instance')
    return result.data
  }

  const getPeers = async () => {
    const result = await axios.get('/peers')
    return result.data
  }

  const getTrends = async (options = {}) => {
    console.log('trends')
    const result = await axios.get('/trends?' + queryString.stringify(options))
    return result.data
  }

  return {
    getActivity,
    getCustomEmojis,
    getDirectory,
    getInstance,
    getPeers,
    getTrends
  }
}
