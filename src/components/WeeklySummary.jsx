import { useMemo } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Card } from '@/components/ui/Card'
import { toDisplay } from '@/utils/weight'

function getISOWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return (
    `${d.getFullYear()}-W` +
    String(1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)).padStart(2, '0')
  )
}

export function WeeklySummary() {
  const weights = useWeightStore((s) => s.weights)
  const unit = useSettingsStore((s) => s.settings?.unit ?? 'kg')

  const summary = useMemo(() => {
    if (!weights.length) return null

    const byWeek = {}
    for (const w of weights) {
      const key = getISOWeek(w.date)
      if (!byWeek[key]) byWeek[key] = []
      byWeek[key].push(Number(w.weight))
    }

    const weeks = Object.keys(byWeek).sort().reverse()
    if (weeks.length < 2) return null

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
    const thisWeekKg = avg(byWeek[weeks[0]])
    const lastWeekKg = avg(byWeek[weeks[1]])
    const deltaKg = thisWeekKg - lastWeekKg

    return {
      thisWeek: toDisplay(thisWeekKg, unit),
      delta: toDisplay(Math.abs(deltaKg), unit),
      direction: deltaKg < -0.01 ? 'down' : deltaKg > 0.01 ? 'up' : 'flat',
      entries: byWeek[weeks[0]].length,
    }
  }, [weights, unit])

  if (!summary) return null

  const { thisWeek, delta, direction, entries } = summary

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">This week</p>
        <span className="text-xs text-gray-300">{entries} {entries === 1 ? 'entry' : 'entries'}</span>
      </div>

      <div className="mt-2 flex items-end gap-3">
        <span className="font-mono text-2xl font-semibold tabular-nums text-gray-900">
          {thisWeek.toFixed(1)}
          <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span>
        </span>

        {direction === 'down' && (
          <span className="mb-0.5 flex items-center gap-1 text-sm text-lime-600">
            <TrendingDown size={14} /> {delta.toFixed(1)} {unit} vs last week
          </span>
        )}
        {direction === 'up' && (
          <span className="mb-0.5 flex items-center gap-1 text-sm text-red-400">
            <TrendingUp size={14} /> +{delta.toFixed(1)} {unit} vs last week
          </span>
        )}
        {direction === 'flat' && (
          <span className="mb-0.5 flex items-center gap-1 text-sm text-gray-400">
            <Minus size={14} /> same as last week
          </span>
        )}
      </div>
    </Card>
  )
}
