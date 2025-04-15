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

const chartData = computed(() => ({
  labels: chartDataPoints.value.map((item) => item.date), // labels ocultas
  datasets: [
    {
      data: chartDataPoints.value.map((item) => item.value),
      borderColor: '#7ccf00',
      backgroundColor: 'transparent',
      tension: 0.3,
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
    <div class="flex justify-end mb-2 gap-2">
      <button
        v-for="range in ['1w', '1m', '1y']"
        :key="range"
        @click="timeRange = range"
        class="text-xs px-2 py-1 rounded hover:bg-gray-100"
        :class="{ 'bg-gray-200 font-semibold': timeRange === range }"
      >
        {{ range }}
      </button>
    </div>

    <div class="h-48 w-full flex items-center justify-center" v-if="chartDataPoints.length === 0">
      <p class="text-sm text-gray-500">No data available for this period.</p>
    </div>

    <div v-else class="h-48 w-full">
      <Line :data="chartData" :options="chartOptions" class="w-full" />
    </div>
  </BaseTile>
</template>

<style scoped>
:deep(canvas) {
  width: 100% !important;
}
</style>
