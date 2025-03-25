<script setup>
import BaseTile from './BaseTile.vue'
import { useGoalProgress } from '@/services/useGoalProgress'

const { currentWeight, trackingStrategy } = useGoalProgress()
</script>

<template>
  <div>
    <BaseTile>
      <div>
        <!-- Current Weight -->
        <div class="flex flex-col items-center">
          <div class="text-4xl font-bold text-slate-700 mb-2">
            {{ currentWeight !== null ? currentWeight.toFixed(2) + ' kg' : 'No data' }}
          </div>
          <div class="text-sm">
            Current Weight
            <span class="text-gray-500 text-xs" v-if="trackingStrategy === 'moving_average'">
              (Moving Average)
            </span>
          </div>
        </div>

        <!-- Prompt Text -->
      </div>
    </BaseTile>
    <div class="mt-4 text-center text-sm text-gray-600">
      <p class="mb-3">🎯 Set your goal and start your journey.</p>
      <RouterLink to="/app/configuration">
        <button class="bg-lime-500 text-white px-4 py-1 rounded-2xl cursor-pointer">
          Get Started
        </button>
      </RouterLink>
    </div>
  </div>
</template>
