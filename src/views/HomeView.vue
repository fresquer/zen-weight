<script setup>
import { ref } from 'vue'
import LogHistoryTile from '@/components/LogHistoryTile.vue'
import PrgroessSummaryTile from '../components/ProgressSummaryTile.vue'
import RegisterWeightModal from '../components/RegisterWeightModal.vue'

const modal = ref(null)

const openModal = () => {
  modal.value.openModal()
}
</script>

<template>
  <div>
    <PrgroessSummaryTile />
    <div class="flex justify-center pt-2 py-4">
      <RegisterWeightModal ref="modal" />
      <button
        class="px-8 py-2 bg-green-500 text-white rounded-full cursor-pointer hover:bg-green-400"
        @click="openModal"
      >
        Add register
      </button>
    </div>
    <LogHistoryTile />
    <div class="flex justify-center mt-8 py-4">
      <RouterLink to="/app/configuration">
        <p class="text-gray-400 cursor-pointer">Configuration</p>
      </RouterLink>
    </div>
  </div>
</template>
