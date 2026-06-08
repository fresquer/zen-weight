import { toDisplay } from './weight'

export function exportWeightsCSV(weights, unit = 'kg') {
  const header = ['date', `weight_${unit}`, 'note']
  const rows = weights.map((w) => {
    const val = toDisplay(Number(w.weight), unit).toFixed(2)
    const note = (w.note ?? '').replace(/"/g, '""')
    return [`"${w.date}"`, val, `"${note}"`]
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
