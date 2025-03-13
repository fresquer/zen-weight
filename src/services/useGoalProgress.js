import { computed, watchEffect } from 'vue';
import { useWeightStore } from '@/services/useWeightTracker';
import { useUserSettings } from '@/services/useUserSettings';

export function useGoalProgress() {
  const weightStore = useWeightStore();
  const { settings, fetchSettings } = useUserSettings();

  watchEffect(() => {
    weightStore.fetchWeights();
    fetchSettings();
  });

  const currentWeight = computed(() => {
    if (!weightStore.weights.length) return null;
    return settings.value.tracking_strategy === 'moving_average'
      ? weightStore.weights.reduce((acc, w) => acc + w.weight, 0) / weightStore.weights.length
      : weightStore.weights[0].weight;
  });

  const stepsCompleted = computed(() => {
    if (!currentWeight.value || !settings.value.goal_segments || !settings.value.starting_weight || !settings.value.target_weight) return 0;
    const stepSize = (settings.value.starting_weight - settings.value.target_weight) / settings.value.goal_segments;
    return Math.floor((settings.value.starting_weight - currentWeight.value) / stepSize);
  });

  const goalWeightStep = computed(() => {
    if (!settings.value.goal_segments || !settings.value.starting_weight || !settings.value.target_weight) return null;
    const stepSize = (settings.value.starting_weight - settings.value.target_weight) / settings.value.goal_segments;
    return settings.value.starting_weight - (stepSize * (stepsCompleted.value + 1));
  });

  const totalSteps = computed(() => settings.value.goal_segments || 0);

  const stepCompletionPercentage = computed(() => {
    if (!currentWeight.value || !goalWeightStep.value) return 0;
    const stepStartWeight = settings.value.starting_weight - ((stepsCompleted.value) * ((settings.value.starting_weight - settings.value.target_weight) / settings.value.goal_segments));
    const stepSize = (settings.value.starting_weight - settings.value.target_weight) / settings.value.goal_segments;
    return Math.min(Math.max(((stepStartWeight - currentWeight.value) / stepSize) * 100, 0), 100);
  });

  const trackingStrategy = computed(() => settings.value.tracking_strategy || 'last_weight');

  return {
    currentWeight,
    goalWeightStep,
    totalSteps,
    stepsCompleted,
    stepCompletionPercentage,
    trackingStrategy
  };
}
