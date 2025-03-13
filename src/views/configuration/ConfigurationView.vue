<script setup>
import { onMounted } from 'vue'
import BasicConfiguration from './components/BasicConfiguration.vue'
import { useUserSettings } from '@/services/useUserSettings'
import ProgressGoalConfiguration from './components/ProgressGoalConfiguration.vue'
const { settings, fetchSettings } = useUserSettings()

onMounted(fetchSettings)
</script>

<template>
  <div class="space-y-6">
    <router-link to="/app" class="text-gray-600 hover:text-gray-800 mb-4 block">
      &larr; Back
    </router-link>
    <h1 class="text-2xl font-bold">Configuration</h1>
    <BasicConfiguration :settings="settings" />
    <ProgressGoalConfiguration :settings="settings" />
  </div>
</template>
