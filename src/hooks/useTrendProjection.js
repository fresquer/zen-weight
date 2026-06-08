import { useMemo } from 'react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'

const MIN_ENTRIES = 7
const WINDOW_DAYS = 28

export function useTrendProjection() {
  const weights = useWeightStore((s) => s.weights)
  const settings = useSettingsStore((s) => s.settings)

  return useMemo(() => {
    const target = Number(settings?.target_weight)
    if (!target) return null

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - WINDOW_DAYS)

    const recent = weights
      .filter((w) => new Date(w.date) >= cutoff)
      .map((w) => ({ t: new Date(w.date).getTime(), v: Number(w.weight) }))
      .sort((a, b) => a.t - b.t)

    if (recent.length < MIN_ENTRIES) return null

    const n = recent.length
    const sumX = recent.reduce((a, p) => a + p.t, 0)
    const sumY = recent.reduce((a, p) => a + p.v, 0)
    const sumXY = recent.reduce((a, p) => a + p.t * p.v, 0)
    const sumX2 = recent.reduce((a, p) => a + p.t * p.t, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const now = Date.now()
    const current = slope * now + intercept
    const isLosingWeight = slope < 0
    const isGainingWeight = slope > 0
    const targetingLoss = target < current
    const targetingGain = target > current

    const trendMatchesGoal =
      (targetingLoss && isLosingWeight) || (targetingGain && isGainingWeight)

    if (!trendMatchesGoal) return null

    const msToGoal = (target - intercept) / slope - now
    const daysToGoal = msToGoal / (1000 * 60 * 60 * 24)

    if (daysToGoal < 1 || daysToGoal > 730) return null

    const weeksToGoal = Math.round(daysToGoal / 7)

    return { weeksToGoal, daysToGoal: Math.round(daysToGoal) }
  }, [weights, settings])
}
