<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseTile from './BaseTile.vue'
import { useWeightStore } from '@/services/useWeightTracker'

const weightStore = useWeightStore()
const { weights } = storeToRefs(weightStore)
const { fetchWeights } = weightStore

onMounted(async () => {
  await fetchWeights()
})

const lastWeight = computed(() => (weights.value.length ? weights.value[0].weight : 'No data'))
const previousWeight = computed(() =>
  weights.value.length > 1 ? weights.value[1].weight : 'No data',
)

const averageWeight = computed(() => {
  const last10Weights = weights.value.slice(0, 10).map((w) => w.weight)
  if (!last10Weights.length) return 'No data'

  const avg = last10Weights.reduce((acc, w) => acc + w, 0) / last10Weights.length
  return avg.toFixed(2)
})
</script>

<template>
  <BaseTile>
    <div>
      <!-- Last weight -->
      <div class="flex flex-col items-center">
        <div class="text-xl font-bold">
          {{ lastWeight }}
        </div>
        <div class="text-sm">Last weight</div>
      </div>

      <!-- Previous weight -->
      <div class="flex flex-col items-center">
        <div class="text-xl font-bold">
          {{ previousWeight }}
        </div>
        <div class="text-sm">Previous weight</div>
      </div>

      <!-- Average weight -->
      <div class="flex flex-col items-center">
        <div class="text-xl font-bold">
          {{ averageWeight }}
        </div>
        <div class="text-sm">Average weight (10 days)</div>
      </div>
    </div>
  </BaseTile>
</template>
