import { computed, onMounted } from 'vue'
import { useWeightStore } from '@/services/useWeightTracker'
import { useUserSettings } from '@/services/useUserSettings'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function useGoalProgress() {
  const weightStore = useWeightStore()
  const { settings, fetchSettings } = useUserSettings()

  onMounted(async () => {
    await Promise.all([weightStore.fetchWeights(), fetchSettings()])
  })

  const currentWeight = computed(() => {
    if (!weightStore.weights.length) return null

    if (settings.value.tracking_strategy === 'moving_average') {
      const recentWeights = weightStore.weights.slice(0, 7)
      return recentWeights.reduce((acc, w) => acc + Number(w.weight), 0) / recentWeights.length
    }

    if (settings.value.tracking_strategy === 'lowest_weight') {
      return Math.min(...weightStore.weights.map((w) => Number(w.weight)))
    }

    return Number(weightStore.weights[0].weight)
  })

  const goalMetrics = computed(() => {
    const segments = Number(settings.value.goal_segments)
    const startingWeight = Number(settings.value.starting_weight)
    const targetWeight = Number(settings.value.target_weight)

    if (!segments || !startingWeight || !targetWeight || startingWeight === targetWeight) {
      return null
    }

    const totalChange = targetWeight - startingWeight
    const stepSize = totalChange / segments

    return {
      segments,
      startingWeight,
      targetWeight,
      totalChange,
      stepSize,
    }
  })

  const stepsCompleted = computed(() => {
    if (!currentWeight.value || !goalMetrics.value) return 0

    const progress =
      (currentWeight.value - goalMetrics.value.startingWeight) / goalMetrics.value.totalChange
    return clamp(Math.floor(progress * goalMetrics.value.segments), 0, goalMetrics.value.segments)
  })

  const goalWeightStep = computed(() => {
    if (!goalMetrics.value) return null

    const nextStep = clamp(stepsCompleted.value + 1, 1, goalMetrics.value.segments)
    return goalMetrics.value.startingWeight + goalMetrics.value.stepSize * nextStep
  })

  const totalSteps = computed(() => goalMetrics.value?.segments || 0)

  const stepCompletionPercentage = computed(() => {
    if (!currentWeight.value || !goalMetrics.value) return 0

    const stepStartWeight =
      goalMetrics.value.startingWeight + goalMetrics.value.stepSize * stepsCompleted.value
    const stepProgress =
      ((currentWeight.value - stepStartWeight) / goalMetrics.value.stepSize) * 100

    return clamp(stepProgress, 0, 100)
  })

  const trackingStrategy = computed(() => settings.value.tracking_strategy || 'last_weight')

  return {
    currentWeight,
    goalWeightStep,
    totalSteps,
    stepsCompleted,
    stepCompletionPercentage,
    trackingStrategy,
  }
}
