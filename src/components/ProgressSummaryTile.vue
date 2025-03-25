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
</script>

<template>
  <BaseTile>
    <div>
      <!-- Display the current step weight and steps completed -->
      <div class="flex justify-between items-center mb-1 md:mb-4">
        <div class="text-sm text-gray-500">Current step Weight</div>
        <div class="flex items-center">
          <p>
            <span class="font-bold text-gray-600">{{ stepsCompleted }}</span> of
            <span class="font-bold text-gray-600">{{ totalSteps }}</span>
            <span class="hidden md:inline"> Steps Completed </span>
          </p>
        </div>
      </div>

      <!-- Display the goal weight step and completion percentage -->
      <div class="flex gap-8 justify-between items-end mb-2">
        <!-- Goal Weight Step -->
        <div class="">
          <span class="font-bold text-gray-700 text-[40px] leading-[34px]">
            {{ goalWeightStep !== null ? goalWeightStep.toFixed(1) : 'No data' }}
          </span>
          <span> kg</span>
        </div>

        <p class="">
          <span class="text-sm">Completed </span>
          <span class="text-3xl font-bold text-gray-700">
            {{ stepCompletionPercentage.toFixed(0) }}%
          </span>
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded h-3 mb-2">
        <div
          class="bg-lime-400 h-3 rounded"
          :style="{ width: `${stepCompletionPercentage}%` }"
        ></div>
      </div>

      <!-- Display the current weight and tracking strategy -->
      <div class="flex items-end">
        <div class="text-sm block md:flex gap-1 items-center">
          <p>
            Current Weight
            <span class="font-bold">
              {{ currentWeight !== null ? currentWeight.toFixed(2) : 'No data' }} kg
            </span>
          </p>
          <p class="text-gray-500 text-xs" v-if="trackingStrategy === 'moving_average'">
            (Moving Average)
          </p>
        </div>
      </div>
    </div>
  </BaseTile>
</template>
