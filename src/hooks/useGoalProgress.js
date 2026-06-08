import { useMemo } from 'react'
import { useWeightStore } from '@/store/weightStore'
import { useSettingsStore } from '@/store/settingsStore'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function useGoalProgress() {
  const weights = useWeightStore((s) => s.weights)
  const settings = useSettingsStore((s) => s.settings)

  const currentWeight = useMemo(() => {
    if (!weights.length) return null
    const strategy = settings.tracking_strategy

    if (strategy === 'moving_average') {
      const recent = weights.slice(0, 7)
      return recent.reduce((acc, w) => acc + Number(w.weight), 0) / recent.length
    }
    if (strategy === 'lowest_weight') {
      return Math.min(...weights.map((w) => Number(w.weight)))
    }
    return Number(weights[0].weight)
  }, [weights, settings.tracking_strategy])

  const goalMetrics = useMemo(() => {
    const segments = Number(settings.goal_segments)
    const startingWeight = Number(settings.starting_weight)
    const targetWeight = Number(settings.target_weight)

    if (!segments || !startingWeight || !targetWeight || startingWeight === targetWeight)
      return null

    const totalChange = targetWeight - startingWeight
    const stepSize = totalChange / segments
    return { segments, startingWeight, targetWeight, totalChange, stepSize }
  }, [settings.goal_segments, settings.starting_weight, settings.target_weight])

  const stepsCompleted = useMemo(() => {
    if (currentWeight === null || !goalMetrics) return 0
    const progress =
      (currentWeight - goalMetrics.startingWeight) / goalMetrics.totalChange
    return clamp(Math.floor(progress * goalMetrics.segments), 0, goalMetrics.segments)
  }, [currentWeight, goalMetrics])

  const goalWeightStep = useMemo(() => {
    if (!goalMetrics) return null
    const nextStep = clamp(stepsCompleted + 1, 1, goalMetrics.segments)
    return goalMetrics.startingWeight + goalMetrics.stepSize * nextStep
  }, [goalMetrics, stepsCompleted])

  const stepCompletionPercentage = useMemo(() => {
    if (currentWeight === null || !goalMetrics) return 0
    const stepStartWeight =
      goalMetrics.startingWeight + goalMetrics.stepSize * stepsCompleted
    const stepProgress =
      ((currentWeight - stepStartWeight) / goalMetrics.stepSize) * 100
    return clamp(stepProgress, 0, 100)
  }, [currentWeight, goalMetrics, stepsCompleted])

  const isGoalEnabled =
    settings.target_weight > 0 && settings.starting_weight > 0 && Boolean(goalMetrics)

  return {
    currentWeight,
    goalWeightStep,
    totalSteps: goalMetrics?.segments ?? 0,
    stepsCompleted,
    stepCompletionPercentage,
    trackingStrategy: settings.tracking_strategy ?? 'last_weight',
    isGoalEnabled,
  }
}
