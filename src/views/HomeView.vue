<script setup>
import ProgressSummaryTile from '../components/ProgressSummaryTile.vue'
import SimpleProgressSummaryTile from '@/components/SimpleProgressSummaryTile.vue'
import ProgressChartTile from '@/components/ProgressChartTile.vue'
import BaseTile from '@/components/BaseTile.vue'

import { useUserSettings } from '@/services/useUserSettings'
import { computed, onMounted } from 'vue'
const { settings, fetchSettings } = useUserSettings()

onMounted(fetchSettings)

const isGoalSettingEnabled = computed(() => {
  return (
    settings.value.target_weight !== null &&
    settings.value.starting_weight !== null &&
    settings.value.target_weight > 0 &&
    settings.value.starting_weight > 0
  )
})
</script>

<template>
  <div>
    <ProgressSummaryTile v-if="isGoalSettingEnabled" />
    <SimpleProgressSummaryTile v-else />
    <div class="h-4"></div>
    <ProgressChartTile />
    <div class="h-4"></div>
    <BaseTile>
      <router-link
        to="/app/registers"
        class="flex items-center justify-center gap-3 text-center font-semibold text-slate-600 hover:text-slate-800"
      >
        <!-- data icon -->
        <svg
          class="text-lime-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="4" width="18" height="4" rx="1" fill="currentColor" />
          <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" />
          <rect x="3" y="16" width="18" height="4" rx="1" fill="currentColor" />
          <circle cx="6" cy="8" r="1" fill="white" />
          <circle cx="6" cy="14" r="1" fill="white" />
          <circle cx="6" cy="20" r="1" fill="white" />
        </svg>

        <p>My weight registers</p>
      </router-link>
    </BaseTile>
    <div class="flex justify-center mt-4 py-4">
      <RouterLink to="/app/configuration" class="page-link">
        <!-- Gear Icon --->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p>Configuration</p>
      </RouterLink>
    </div>
  </div>
</template>
