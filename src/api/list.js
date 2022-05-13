import { processResults } from '@/utils/Axios'

export const apiList = (axios) => {
  const getList = async (id, options = {}) => {
    const result = await axios.get('/lists/' + id)
    return processResults(result)
  }

  const getLists = async (id) => {
    const result = await axios.get('/lists')
    return processResults(result)
  }

  return {
    getList,
    getLists
  }
}
