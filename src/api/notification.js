import { queryString, processResults } from '@/utils/Axios'

export const apiNotification = (axios) => {
  const notifications = async (options = {}) => {
    const result = await axios.get('/notifications?' + queryString.stringify(options))
    return processResults(result)
  }

  return {
    notifications
  }
}
