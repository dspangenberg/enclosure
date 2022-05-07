import de from 'numbro/languages/de-DE'
import numbro from 'numbro'
import { DateTime } from 'luxon'
import { marked } from 'marked'

numbro.registerLanguage(de, true)
numbro.setLanguage('de-DE')

export function useTemplateFilter () {
  const formatAccounId = (value) => {
    if (!value) return
    return numbro(value).format({ thousandSeparated: true })
  }

  /*
  const formatDuration = (value) => {
    if (!value) return
    const dur = Duration.fromObject({ minutes: value })
    return dur.toFormat('h:mm')
  }
  */

  const formatDate = (value) => {
    if (!value) return ''
    return DateTime.fromISO(value).toFormat('dd.MM.yyyy')
  }

  const formatDateTime = (value) => {
    if (!value) return ''
    return DateTime.fromISO(value).toFormat('dd.MM.yyyy HH:mm')
  }

  const formatMarkdown = (value) => {
    return marked(value)
  }

  const formatCurrency = (value) => {
    if (!value) return
    return numbro(value).formatCurrency({ mantissa: 2, thousandSeparated: true, spaceSeparated: true })
  }

  const formatFloat = (value, unit = '') => {
    if (!value) return
    return (numbro(value).format({ mantissa: 2, thousandSeparated: true }) + ' ' + unit).trim()
  }
  const formatInt = (value, unit = '') => {
    if (!value) return
    return (numbro(value).format({ thousandSeparated: true }) + ' ' + unit).trim()
  }
  function getImageUrl (name) {
    return new URL(`/${name}`, import.meta.env.VITE_APP_ASSETS).href
  }

  const formatBytes = (value) => {
    if (!value) return
    return numbro(value).format({
      output: 'byte',
      base: 'binary',
      mantissa: 0,
      spaceSeparated: true
    })
  }

  return { formatAccounId, formatCurrency, formatDate, getImageUrl, formatFloat, formatBytes, formatMarkdown, formatInt, formatDateTime }
}
