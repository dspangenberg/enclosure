import { getData, queryString } from '@/api/axios'

export const apiInstance = (axios) => {
  const activity = async () => {
    const result = await axios.get('/instance/activity')
    return result.data
  }

  const customEmojis = async () => {
    const result = await axios.get('/custom_emojis')
    return result.data
  }

  const directory = async (options = {}) => {
    const result = await axios.get('/directory?' + queryString.stringify(options))
    return result.data
  }

  const instance = async () => {
    const result = await axios.get('/instance')
    return result.data
  }

  const peers = async () => {
    const result = await axios.get('/peers')
    return result.data
  }

  const trends = async (options = {}) => {
    const result = await axios.get('/trends?' + queryString.stringify(options))
    return result.data
  }

  return {
    activity,
    customEmojis,
    directory,
    instance,
    peers,
    trends
  }
}
