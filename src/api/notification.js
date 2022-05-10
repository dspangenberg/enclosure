import { getData, queryString } from '@/api/axios'

export const apiNotification = (axios) => {
  const notifications = async (options = {}) => {
    const result = await axios.get('/notifications?' + queryString.stringify(options))
    return result.data
  }

  return {
    notifications
  }
}
