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
    <div class="space-y-4">
      <!-- Display the current step weight and steps completed -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-sm font-semibold text-slate-700">Current step</div>
          <p class="mt-1 text-xs text-slate-400">Small targets, steady progress</p>
        </div>
        <div class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
          <p class="whitespace-nowrap">
            <span class="font-bold text-slate-700">{{ stepsCompleted }}</span> /
            <span class="font-bold text-slate-700">{{ totalSteps }}</span>
            <span class="hidden sm:inline"> completed</span>
          </p>
        </div>
      </div>

      <!-- Display the goal weight step and completion percentage -->
      <div class="flex gap-6 justify-between items-end">
        <!-- Goal Weight Step -->
        <div>
          <span class="text-[42px] font-bold leading-none text-slate-800">
            {{ goalWeightStep !== null ? goalWeightStep.toFixed(1) : 'No data' }}
          </span>
          <span class="text-slate-400"> kg</span>
        </div>

        <p class="text-right">
          <span class="block text-xs text-slate-400">Completed</span>
          <span class="text-3xl font-bold text-slate-800">
            {{ stepCompletionPercentage.toFixed(0) }}%
          </span>
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="h-3 w-full overflow-hidden rounded-lg bg-slate-100">
        <div
          class="h-3 rounded-lg bg-lime-400"
          :style="{ width: `${stepCompletionPercentage}%` }"
        ></div>
      </div>

      <!-- Display the current weight and tracking strategy -->
      <div class="flex items-end">
        <div class="block text-sm text-slate-500 sm:flex sm:items-center sm:gap-1">
          <p>
            Current Weight
            <span class="font-bold text-slate-700">
              {{ currentWeight !== null ? currentWeight.toFixed(2) : 'No data' }} kg
            </span>
          </p>
          <p class="text-xs text-slate-400" v-if="trackingStrategy === 'moving_average'">
            (Moving Average)
          </p>
        </div>
      </div>
    </div>
  </BaseTile>
</template>
