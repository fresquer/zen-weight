<script setup>
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import BaseTile from './BaseTile.vue'
import RegisterWeightModal from './RegisterWeightModal.vue'
import { useWeightStore } from '@/services/useWeightTracker'
import { formatDate, getTimeFromTimestamp } from '@/utils/dates'

const weightStore = useWeightStore()
const { weights } = storeToRefs(weightStore)
const { fetchWeights, deleteWeight } = weightStore

const editingEntry = ref(null)
const registerModalRef = ref(null)

onMounted(async () => {
  try {
    await fetchWeights()
  } catch (error) {
    console.error('Error loading initial weights:', error)
  }
})

const list = computed(() => {
  return weights.value?.length
    ? weights.value.map((w) => ({ id: w.id, date: w.date, value: w.weight }))
    : []
})

const startEdit = (entry) => {
  editingEntry.value = entry
  registerModalRef.value?.openModal()
}

const handleDelete = async (id) => {
  if (!window.confirm('Delete this weight register?')) return

  try {
    await deleteWeight(id)
  } catch (error) {
    console.error('Error deleting weight:', error)
  }
}
</script>

<template>
  <BaseTile>
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-slate-800">Register history</h2>
        <p class="text-xs text-slate-400">Latest entries first</p>
      </div>
    </div>

    <div class="divide-y divide-slate-100" v-if="list.length > 0">
      <div
        v-for="entry in list"
        :key="entry.id"
        class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
      >
        <div>
          <p class="text-sm font-semibold text-slate-700">{{ formatDate(entry.date) }}</p>
          <p class="text-xs text-slate-400">{{ getTimeFromTimestamp(entry.date) }}</p>
        </div>
        <div class="flex items-center gap-1">
          <div class="mr-2 flex items-baseline">
            <span class="font-semibold text-slate-800">{{ entry.value }}</span>
            <span class="ml-1 text-xs text-slate-400">kg</span>
          </div>
          <button @click="startEdit(entry)" class="icon-button" aria-label="Edit register">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button @click="handleDelete(entry.id)" class="icon-button" aria-label="Delete register">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="my-14 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-400 sm:mx-8">
        Start by adding your first weight register. It is the first step to tracking your progress.
      </div>
    </div>

    <RegisterWeightModal ref="registerModalRef" :editingEntry="editingEntry" />
  </BaseTile>
</template>
