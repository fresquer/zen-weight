export const formatDate = (date) => {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const getTimeFromTimestamp = (timestamp) => {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
