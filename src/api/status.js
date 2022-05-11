import { processResults } from '@/utils/Axios'

export const apiStatus = (axios) => {
  const bookmark = async (id) => {
    const result = await axios.post(`/statuses/${id}/bookmark`)
    return processResults(result)
  }

  const favourite = async (id) => {
    const result = await axios.post(`/statuses/${id}/favourite`)
    return processResults(result)
  }

  const mute = async (id) => {
    const result = await axios.post(`/statuses/${id}/mute`)
    return processResults(result)
  }

  const pin = async (id) => {
    const result = await axios.post(`/statuses/${id}/pin`)
    return processResults(result)
  }

  const poll = async (id, choices) => {
    const result = await axios.post(`/polls/${id}/votes`, { choices })
    return processResults(result)
  }

  const reblog = async (id) => {
    const result = await axios.post(`/statuses/${id}/reblog`)
    return processResults(result)
  }

  const unbookmark = async (id) => {
    const result = await axios.post(`/statuses/${id}/unbookmark`)
    return processResults(result)
  }

  const unfavourite = async (id) => {
    const result = await axios.post(`statuses/${id}/unfavourite`)
    return processResults(result)
  }

  const unmute = async (id) => {
    const result = await axios.post(`/statuses/${id}/unmute`)
    return processResults(result)
  }

  const unpin = async (id) => {
    const result = await axios.post(`/statuses/${id}/unpin`)
    return processResults(result)
  }

  const unreblog = async (id) => {
    const result = await axios.post(`/statuses/${id}/unreblog`)
    return processResults(result)
  }

  return {
    bookmark,
    favourite,
    mute,
    pin,
    poll,
    reblog,
    unbookmark,
    unfavourite,
    unmute,
    unpin,
    unreblog
  }
}
