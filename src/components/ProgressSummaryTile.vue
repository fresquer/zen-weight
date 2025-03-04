<script setup>
import { computed, onMounted } from 'vue'
import BaseTile from './BaseTile.vue'
import { useWeight } from '@/services/useWeightTracker'

const { weights, fetchWeights } = useWeight()

onMounted(async () => {
  await fetchWeights() // Asegurar que se ejecuta correctamente
})

// 📌 Computed para obtener valores de peso
const lastWeight = computed(() => (weights.value.length ? weights.value[0].weight : 'No data'))
const previousWeight = computed(() =>
  weights.value.length > 1 ? weights.value[1].weight : 'No data',
)

// 📌 Calcular el peso promedio de los últimos `n` días
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
