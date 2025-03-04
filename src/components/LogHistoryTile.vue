<script setup>
import BaseTile from './BaseTile.vue'
import { useWeightStore } from '../stores/useWeightStore.js'

const weightStore = useWeightStore()

const list = weightStore.weights
</script>

<template>
  <BaseTile
    >Log History

    <div class="flex flex-col space-y-2">
      <div v-for="entry in list" :key="entry.date" class="flex justify-between">
        <div>{{ entry.date }}</div>
        <div>{{ entry.value }}</div>
      </div>
    </div>
  </BaseTile>
</template>
