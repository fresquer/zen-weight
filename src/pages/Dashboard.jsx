import { useEffect } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useGoalProgress } from '@/hooks/useGoalProgress'
import { GoalProgress } from '@/components/GoalProgress'
import { WeightChart } from '@/components/WeightChart'

function DeltaBadge({ weights }) {
  if (weights.length < 2) return null
  const latest = Number(weights[0].weight)
  const prev = Number(weights[1].weight)
  const delta = latest - prev
  const abs = Math.abs(delta).toFixed(1)

  if (delta === 0)
    return (
      <span className="flex items-center gap-1 text-sm text-gray-400">
        <Minus size={14} /> {abs} kg
      </span>
    )
  if (delta < 0)
    return (
      <span className="flex items-center gap-1 text-sm text-lime-600">
        <TrendingDown size={14} /> {abs} kg
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-sm text-red-400">
      <TrendingUp size={14} /> +{abs} kg
    </span>
  )
}

export function Dashboard() {
  const { fetchWeights, weights } = useWeightStore()
  const { fetchSettings } = useSettingsStore()
  const { currentWeight, isGoalEnabled, trackingStrategy } = useGoalProgress()

  useEffect(() => {
    fetchWeights()
    fetchSettings()
  }, [fetchWeights, fetchSettings])

  return (
    <div className="space-y-4">
      {/* Hero weight */}
      <div className="py-4">
        <div className="flex items-end gap-3">
          <span className="font-mono text-7xl font-bold tabular-nums leading-none text-gray-900">
            {currentWeight !== null ? currentWeight.toFixed(1) : '—'}
          </span>
          <div className="mb-2 flex flex-col gap-1">
            <span className="text-xl text-gray-400">kg</span>
            <DeltaBadge weights={weights} />
          </div>
        </div>
        {trackingStrategy === 'moving_average' && (
          <p className="mt-2 text-xs text-gray-400">7-day moving average</p>
        )}
        {trackingStrategy === 'lowest_weight' && (
          <p className="mt-2 text-xs text-gray-400">Lowest recorded weight</p>
        )}
        {currentWeight === null && (
          <p className="mt-2 text-xs text-gray-400">Log your first weight to get started</p>
        )}
      </div>

      {/* Goal progress */}
      {isGoalEnabled && <GoalProgress />}

      {/* Chart */}
      <WeightChart />
    </div>
  )
}
