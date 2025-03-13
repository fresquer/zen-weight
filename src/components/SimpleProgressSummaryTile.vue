<script setup>
import BaseTile from './BaseTile.vue'
import { useGoalProgress } from '@/services/useGoalProgress'

const { currentWeight, trackingStrategy } = useGoalProgress()

console.log(trackingStrategy)
</script>

<template>
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
            (Moving Average)</span
          >
        </div>
      </div>
    </div>
  </BaseTile>
</template>
