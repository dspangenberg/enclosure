import { getData, queryString } from '@/api/axios'

export const apiTimeline = (axios) => {
  const timelineConversations = async (options = {}) => {
    options.remote = true
    const result = await axios.get('/conversations?' + queryString.stringify(options))
    return result.data
  }

  const timelineFederation = async (options = {}) => {
    options.remote = true
    const result = await timelinePublic(options)
    return result
  }

  const timelineHashtag = async (tag, options = {}) => {
    const result = await axios.get('/timelines/tag/' + tag + '/?' + queryString.stringify(options))
    return result.data
  }

  const timelineHome = async (options = {}) => {
    const result = await axios.get('/timelines/home?' + queryString.stringify(options))
    return result.data
  }

  const timelineList = async (list, options = {}) => {
    const result = await axios.get('/timelines/list/' + list + '/?' + queryString.stringify(options))
    return result.data
  }

  const timelineLocal = async (options = {}) => {
    options.local = true
    const result = await timelinePublic(options)
    return result
  }

  const timelinePublic = async (options = {}) => {
    const result = await axios.get('/timelines/public?' + queryString.stringify(options))
    return result.data
  }

  return {
    timelineConversations,
    timelineFederation,
    timelineHashtag,
    timelineHome,
    timelineList,
    timelineLocal,
    timelinePublic
  }
}
