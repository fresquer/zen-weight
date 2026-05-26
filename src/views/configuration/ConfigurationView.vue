<script setup>
import { onMounted } from 'vue'
import BasicConfiguration from './components/BasicConfiguration.vue'
import { useUserSettings } from '@/services/useUserSettings'
import ProgressGoalConfiguration from './components/ProgressGoalConfiguration.vue'
const { settings, fetchSettings } = useUserSettings()

onMounted(fetchSettings)
</script>

<template>
  <div class="space-y-4">
    <router-link to="/app" class="page-link">
      &larr; Back
    </router-link>
    <div class="px-1">
      <h1 class="text-2xl font-bold text-slate-800">Configuration</h1>
      <p class="mt-1 text-sm text-slate-400">Tune your tracking without adding noise.</p>
    </div>
    <ProgressGoalConfiguration :settings="settings" />
    <BasicConfiguration :settings="settings" />
  </div>
</template>
