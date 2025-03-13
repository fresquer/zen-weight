<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import BaseTile from '@/components/BaseTile.vue'
import { useAuth } from '@/services/useAuth'
import { useUserSettings } from '@/services/useUserSettings'

const auth = useAuth()
const { settings, updateSettings } = useUserSettings()

const userEmail = computed(() => {
  return auth.user.value?.email || 'Unknown User'
})

onMounted(async () => {
  await auth.checkSession()
})

const logOut = () => {
  auth.logout()
}

const trackingStrategies = [
  { value: 'moving_average', label: '10 days of moving Average' },
  { value: 'last_weight', label: 'Last Weight' },
  //{ value: 'lowest_weight', label: 'Lowest Weight' },
]
</script>

<template>
  <BaseTile>
    <div class="p-4">
      <div class="flex justify-between items-center mb-8">
        <p><b>Logged as:</b> {{ userEmail }}</p>
        <p class="text-red-400 cursor-pointer" @click="logOut">Log out</p>
      </div>

      <!--
      <div class="mb-4">
        <label class="block text-sm font-medium">Weight Unit</label>
        <select
          v-model="settings.weight_unit"
          @change="updateSettings({ weight_unit: settings.weight_unit })"
          class="w-full p-2 border rounded"
        >
          <option value="kg">Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
        </select>
      </div>
      -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Tracking Strategy</label>
        <select
          v-model="settings.tracking_strategy"
          @change="updateSettings({ tracking_strategy: settings.tracking_strategy })"
          class="w-full p-2 border rounded text-xs border-gray-300 rounded-xl"
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
        class="text-sm text-gray-500 mb-4 bg-gray-100 p-4 rounded-xl"
        v-if="settings.tracking_strategy === 'moving_average'"
      >
        The <b>moving average weight</b> smooths daily fluctuations to show your real progress. It
        averages several days' weights, so you see trends instead of daily ups and downs.
      </div>

      <!--
      <div class="mb-4">
        <label class="block text-sm font-medium">Tracking Days</label>
        <input
          type="number"
          v-model="settings.tracking_days"
          @change="updateSettings({ tracking_days: settings.tracking_days })"
          class="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div class="mb-4 flex items-center">
        <label class="text-sm font-medium flex-1">Enable Notifications</label>
        <input
          type="checkbox"
          v-model="settings.notifications_enabled"
          @change="updateSettings({ notifications_enabled: settings.notifications_enabled })"
          class="ml-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Theme</label>
        <select
        v-model="settings.theme"
        @change="updateSettings({ theme: settings.theme })"
        class="w-full p-2 border rounded"
        >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
       -->
    </div>
  </BaseTile>
</template>
