<script setup>
import { onMounted } from 'vue'
import BaseTile from '@/components/BaseTile.vue'
import { useUserSettings } from '@/services/useUserSettings'
import { useWeightStore } from '@/services/useWeightTracker'
import { formatDate } from '@/utils/dates'

const { settings, updateSettings } = useUserSettings()
const { weights, fetchWeights } = useWeightStore()

onMounted(async () => {
  await fetchWeights()
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
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-slate-800">Weight goal</h3>
        <p class="mt-1 text-xs text-slate-400">Set the target and how progress is calculated.</p>
      </div>

      <div>
        <label class="form-label">Target Weight</label>
        <input
          type="number"
          v-model.number="settings.target_weight"
          @change="saveSettings('target_weight', settings.target_weight)"
          class="form-input"
          step="0.1"
          min="0"
        />
      </div>

      <div>
        <label class="form-label">Starting Weight</label>
        <select
          v-model="settings.starting_weight"
          @change="saveSettings('starting_weight', parseFloat(settings.starting_weight))"
          class="form-input"
        >
          <option :value="null" disabled>Select your starting weight</option>
          <option v-for="weight in weights" :key="weight.id" :value="weight.weight">
            {{ weight.weight }} kg ({{ formatDate(weight.date) }})
          </option>
        </select>
      </div>

      <div>
        <label class="form-label">Goal Segments</label>
        <input
          type="number"
          v-model.number="settings.goal_segments"
          @change="saveSettings('goal_segments', settings.goal_segments)"
          class="form-input"
          min="1"
        />
      </div>

      <div>
        <label class="form-label">Tracking Strategy</label>
        <select
          v-model="settings.tracking_strategy"
          @change="updateSettings({ tracking_strategy: settings.tracking_strategy })"
          class="form-input"
        >
          <option
            v-for="option in trackingStrategies"
            :key="option.value"
            :value="option.value"
            class="text-xs"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div
        class="rounded-lg border border-lime-100 bg-lime-50/70 p-4 text-sm text-slate-600"
        v-if="settings.tracking_strategy === 'moving_average'"
      >
        The <b>moving average weight</b> smooths daily fluctuations to show your real progress. It
        averages several days' weights, so you see trends instead of daily ups and downs.
      </div>
    </div>
  </BaseTile>
</template>
