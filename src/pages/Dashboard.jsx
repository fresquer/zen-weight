import { useEffect } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useGoalProgress } from '@/hooks/useGoalProgress'
import { useTrendProjection } from '@/hooks/useTrendProjection'
import { GoalProgress } from '@/components/GoalProgress'
import { WeightChart } from '@/components/WeightChart'
import { WeeklySummary } from '@/components/WeeklySummary'
import { toDisplay } from '@/utils/weight'

function DeltaBadge({ weights, unit }) {
  if (weights.length < 2) return null
  const latest = Number(weights[0].weight)
  const prev = Number(weights[1].weight)
  const delta = toDisplay(latest - prev, unit)
  const abs = Math.abs(delta).toFixed(1)

  if (Math.abs(delta) < 0.05)
    return (
      <span className="flex items-center gap-1 text-sm text-gray-400">
        <Minus size={14} /> {abs} {unit}
      </span>
    )
  if (delta < 0)
    return (
      <span className="flex items-center gap-1 text-sm text-lime-600">
        <TrendingDown size={14} /> {abs} {unit}
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-sm text-red-400">
      <TrendingUp size={14} /> +{abs} {unit}
    </span>
  )
}

export function Dashboard() {
  const { fetchWeights, weights } = useWeightStore()
  const { fetchSettings } = useSettingsStore()
  const unit = useSettingsStore((s) => s.settings?.unit ?? 'kg')
  const { currentWeight, isGoalEnabled, trackingStrategy } = useGoalProgress()
  const projection = useTrendProjection()

  useEffect(() => {
    fetchWeights()
    fetchSettings()
  }, [fetchWeights, fetchSettings])

  const displayWeight = currentWeight !== null ? toDisplay(currentWeight, unit) : null

  return (
    <div className="space-y-4">
      {/* Hero weight */}
      <div className="py-4">
        <div className="flex items-end gap-3">
          <span className="font-mono text-7xl font-bold tabular-nums leading-none text-gray-900">
            {displayWeight !== null ? displayWeight.toFixed(1) : '—'}
          </span>
          <div className="mb-2 flex flex-col gap-1">
            <span className="text-xl text-gray-400">{unit}</span>
            <DeltaBadge weights={weights} unit={unit} />
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
        {projection && (
          <p className="mt-2 text-xs text-gray-400">
            At this rate, goal in ~
            {projection.weeksToGoal === 1
              ? '1 week'
              : projection.weeksToGoal < 5
              ? `${projection.weeksToGoal} weeks`
              : `${projection.daysToGoal} days`}
          </p>
        )}
      </div>

      {/* Goal progress */}
      {isGoalEnabled && <GoalProgress />}

      {/* Weekly summary */}
      <WeeklySummary />

      {/* Chart */}
      <WeightChart />
    </div>
  )
}
