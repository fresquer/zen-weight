<script setup>
import BaseTile from './BaseTile.vue'
import { useGoalProgress } from '@/services/useGoalProgress'

const {
  currentWeight,
  goalWeightStep,
  stepsCompleted,
  totalSteps,
  stepCompletionPercentage,
  trackingStrategy,
} = useGoalProgress()

console.log(trackingStrategy)
</script>

<template>
  <BaseTile>
    <div>
      <!-- Current Weight -->
      <div class="flex flex-col items-center">
        <div class="text-xl font-bold">
          {{ currentWeight !== null ? currentWeight.toFixed(2) : 'No data' }}
        </div>
        <div class="text-sm">
          Current Weight
          <span class="text-gray-500 text-xs" v-if="trackingStrategy === 'moving_average'">
            (Moving Average)</span
          >
        </div>
      </div>
      <div class="flex gap-8 justify-between mt-8 mb-4">
        <!-- Goal Weight Step -->
        <div class="flex flex-col items-center w-32">
          <div class="text-xl font-bold">
            {{ goalWeightStep !== null ? goalWeightStep.toFixed(2) : 'No data' }}
          </div>
          <div class="text-sm">Goal Weight Step</div>
        </div>

        <!-- Steps Completed -->
        <div class="flex flex-col items-center w-32">
          <div class="text-xl font-bold">{{ stepsCompleted }} / {{ totalSteps }}</div>
          <div class="text-sm">Steps Completed</div>
        </div>

        <!-- Completion Percentage -->
        <div class="flex flex-col items-center w-32">
          <div class="text-xl font-bold">{{ stepCompletionPercentage.toFixed(2) }}%</div>
          <div class="text-sm">Completed</div>
        </div>
      </div>

      <!-- Steps Visualization -->
      <div class="flex gap-2 justify-center mt-8 mb-4">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="w-3 h-3 rounded-full"
          :class="step <= stepsCompleted ? 'bg-green-500' : 'bg-gray-300'"
        ></div>
      </div>
    </div>
  </BaseTile>
</template>
