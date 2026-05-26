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
    <div class="text-lg font-semibold mb-2">Register history</div>

    <div class="flex flex-col space-y-2" v-if="list.length > 0">
      <div v-for="entry in list" :key="entry.id" class="flex justify-between items-center">
        <div>
          {{ formatDate(entry.date) }}
          <span class="text-sm text-gray-400">{{ getTimeFromTimestamp(entry.date) }}</span>
        </div>
        <div class="flex items-center">
          <div>{{ entry.value }}</div>
          <div class="text-sm text-gray-400 ml-1">kg</div>
          <button @click="startEdit(entry)" class="ml-2 text-gray-400 hover:text-gray-600">
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
          <button @click="handleDelete(entry.id)" class="ml-2 text-gray-400 hover:text-gray-600">
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
      <div class="text-center text-gray-400 my-16 px-4 md:px-16 text-sm">
        Start your journey by adding your first weight register. It's the first step to tracking
        your progress! ✨
      </div>
    </div>

    <RegisterWeightModal ref="registerModalRef" :editingEntry="editingEntry" />
  </BaseTile>
</template>
