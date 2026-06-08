import { useState, useEffect, useCallback } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  YAxis,
} from 'recharts'
import { useWeightStore } from '@/store/weightStore'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/utils/dates'

const RANGES = ['1w', '1m', '1y']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="text-gray-400">{formatDate(d.date)}</p>
      <p className="font-mono font-semibold text-gray-900">{d.value} kg</p>
    </div>
  )
}

export function WeightChart() {
  const { fetchWeightsByRange, weights } = useWeightStore()
  const [range, setRange] = useState('1w')
  const [data, setData] = useState([])

  const load = useCallback(async () => {
    try {
      const raw = await fetchWeightsByRange(range)
      let points = raw.map((r) => ({ date: r.date, value: Number(r.weight) }))
      if (points.length === 1) {
        const copy = { ...points[0] }
        const next = new Date(copy.date)
        next.setDate(next.getDate() + 1)
        copy.date = next.toISOString()
        points = [...points, copy]
      }
      setData(points)
    } catch {
      setData([])
    }
  }, [range, fetchWeightsByRange])

  useEffect(() => { load() }, [load])
  useEffect(() => { load() }, [weights.length, load])

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Trend</p>
        <div className="flex rounded-lg border border-gray-200 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                range === r
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-gray-300">No data for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#84cc16"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#84cc16', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
