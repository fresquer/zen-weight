<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseTile from '@/components/BaseTile.vue'
import { useUserSettings } from '@/services/useUserSettings'
import { useWeightStore } from '@/services/useWeightTracker'
import { formatDate } from '@/utils/dates'

const { settings, updateSettings } = useUserSettings()
const { weights, fetchWeights } = useWeightStore()

onMounted(async () => {
  console.log('Component mounted, fetching weights...')
  await fetchWeights()
  console.log('Weights fetched:', weights)
})

watch(weights, (newWeights) => {
  console.log('Weights updated:', newWeights)
})

const trackingStrategies = [
  { value: 'moving_average', label: 'Moving Average' },
  { value: 'last_weight', label: 'Last Weight' },
  { value: 'lowest_weight', label: 'Lowest Weight' },
]

const saveSettings = (field, value) => {
  updateSettings({ [field]: value })
}
</script>

<template>
  <BaseTile>
    <div class="p-4">
      <h3 class="font-bold mb-4">Weight Goal Configuration</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium">Target Weight</label>
        <input
          type="number"
          v-model.number="settings.target_weight"
          @change="saveSettings('target_weight', settings.target_weight)"
          class="w-full p-2 border rounded"
          step="0.1"
          min="0"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Starting Weight</label>
        <select
          v-model="settings.starting_weight"
          @change="saveSettings('starting_weight', parseFloat(settings.starting_weight))"
          class="w-full p-2 border rounded"
        >
          <option :value="null" disabled>Select your starting weight</option>
          <option v-for="weight in weights" :key="weight.id" :value="weight.weight">
            {{ weight.weight }} kg ({{ formatDate(weight.date) }})
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Goal Segments</label>
        <input
          type="number"
          v-model.number="settings.goal_segments"
          @change="saveSettings('goal_segments', settings.goal_segments)"
          class="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Tracking Strategy</label>
        <select
          v-model="settings.tracking_strategy"
          @change="saveSettings('tracking_strategy', settings.tracking_strategy)"
          class="w-full p-2 border rounded"
        >
          <option v-for="option in trackingStrategies" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </BaseTile>
</template>
