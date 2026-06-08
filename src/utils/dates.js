export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getTimeFromTimestamp(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function toLocalDateString(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function toLocalTimeString(date = new Date()) {
  return date.toTimeString().slice(0, 5)
}
