import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const formatTimeAgo = (date) => {
  return timeAgo.format(new Date(date))
}

export const parseDate = (ts) => {
  if (!ts) {
    return
  }

  let dateObj = new Date(ts)
  let month = monthNames[dateObj.getMonth()].slice(0, 3)
  let day = String(dateObj.getDate()).padStart(2, '0')
  let year = dateObj.getFullYear()
  return `${day} ${month} ${year}`
}
