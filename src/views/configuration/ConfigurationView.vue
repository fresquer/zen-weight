<script setup>
import { onMounted } from 'vue'
import BasicConfiguration from './components/BasicConfiguration.vue'
import { useUserSettings } from '@/services/useUserSettings'

const { settings, fetchSettings } = useUserSettings()

onMounted(fetchSettings)
</script>

<template>
  <div>
    <BasicConfiguration :settings="settings" />
  </div>
</template>
