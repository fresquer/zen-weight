<script setup>
import BaseTile from './BaseTile.vue'
import { useGoalProgress } from '@/services/useGoalProgress'

const { currentWeight, trackingStrategy } = useGoalProgress()
</script>

<template>
  <div>
    <BaseTile>
      <div class="py-2">
        <!-- Current Weight -->
        <div class="flex flex-col items-center">
          <div class="mb-2 text-4xl font-bold text-slate-800">
            {{ currentWeight !== null ? currentWeight.toFixed(2) + ' kg' : 'No data' }}
          </div>
          <div class="text-sm text-slate-500">
            Current Weight
            <span class="text-xs text-slate-400" v-if="trackingStrategy === 'moving_average'">
              (Moving Average)
            </span>
          </div>
        </div>

        <!-- Prompt Text -->
      </div>
    </BaseTile>
    <div class="mt-4 text-center text-sm text-slate-500">
      <p class="mb-3">Set your goal and start your journey.</p>
      <RouterLink to="/app/configuration">
        <button class="btn-primary min-h-9 bg-lime-500 px-4 py-1.5 text-slate-900 hover:bg-lime-400">
          Get Started
        </button>
      </RouterLink>
    </div>
  </div>
</template>
