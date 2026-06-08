import { toDisplay } from './weight'

export function exportWeightsCSV(weights, unit = 'kg') {
  const header = ['date', 'time', `weight_${unit}`, 'note']
  const rows = weights.map((w) => {
    const d = new Date(w.date)
    const date = d.toLocaleDateString('sv')
    const time = d.toLocaleTimeString('sv', { hour: '2-digit', minute: '2-digit' })
    const val = toDisplay(Number(w.weight), unit).toFixed(2)
    const note = (w.note ?? '').replace(/"/g, '""')
    return [date, time, val, `"${note}"`]
  })

  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `zen-weight-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
