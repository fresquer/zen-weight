<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

import BaseTile from './BaseTile.vue'
import { useWeightStore } from '@/services/useWeightTracker'

ChartJS.register(Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement)

const timeRange = ref('1w')
const chartDataPoints = ref([])
const weightStore = useWeightStore()

const fetchData = async () => {
  const data = await weightStore.fetchWeightsByRange(timeRange.value)

  // Si solo hay un punto, duplicarlo un día después
  if (data.length === 1) {
    const copy = { ...data[0] }
    const nextDay = new Date(copy.date)
    nextDay.setDate(nextDay.getDate() + 1)
    copy.date = nextDay.toISOString()
    data.push(copy)
  }

  chartDataPoints.value = data.map((entry) => ({
    date: entry.date,
    value: entry.weight,
  }))
}

onMounted(fetchData)
watch(timeRange, fetchData)
watch(() => weightStore.weights.length, fetchData)

const chartData = computed(() => ({
  labels: chartDataPoints.value.map((item) => item.date), // labels ocultas
  datasets: [
    {
      data: chartDataPoints.value.map((item) => item.value),
      borderColor: '#84cc16',
      backgroundColor: 'transparent',
      borderWidth: 3,
      tension: 0.35,
      pointRadius: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  animation: {
    duration: 800,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
}
</script>

<template>
  <BaseTile>
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-slate-700">Trend</h2>
        <p class="text-xs text-slate-400">Your recent movement</p>
      </div>
      <div class="flex rounded-lg bg-slate-100 p-1">
      <button
        v-for="range in ['1w', '1m', '1y']"
        :key="range"
        @click="timeRange = range"
        class="rounded-md px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        :class="{ 'bg-white text-slate-800 shadow-sm': timeRange === range }"
      >
        {{ range }}
      </button>
      </div>
    </div>

    <div class="flex h-52 w-full items-center justify-center" v-if="chartDataPoints.length === 0">
      <p class="text-center text-sm text-slate-400">No data available for this period.</p>
    </div>

    <div v-else class="h-52 w-full">
      <Line :data="chartData" :options="chartOptions" class="w-full" />
    </div>
  </BaseTile>
</template>

<style scoped>
:deep(canvas) {
  width: 100% !important;
}
</style>
