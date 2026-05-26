<script setup>
import { ref, watch } from 'vue'
import { useWeightStore } from '@/services/useWeightTracker'

const weightStore = useWeightStore()
const { addWeight, editWeight, fetchWeights, lastRegister } = weightStore

const props = defineProps({
  editingEntry: {
    type: Object,
    default: null,
  },
})

const weight = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))
const time = ref(new Date().toTimeString().slice(0, 5))
const dialogRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

watch(
  () => props.editingEntry,
  async (newValue) => {
    if (newValue) {
      weight.value = newValue.value
      date.value = newValue.date
        ? newValue.date.split('T')[0]
        : new Date().toISOString().slice(0, 10)
      time.value = newValue.date
        ? newValue.date.split('T')[1].slice(0, 5)
        : new Date().toTimeString().slice(0, 5)
    } else {
      await loadLastWeight()
      date.value = new Date().toISOString().slice(0, 10)
      time.value = new Date().toTimeString().slice(0, 5)
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  const parsedWeight = Number(weight.value)

  if (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || !date.value || !time.value) {
    errorMessage.value = 'Please enter a valid weight, date, and time.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const formattedDateTime = `${date.value}T${time.value}:00`

    if (props.editingEntry) {
      await editWeight(props.editingEntry.id, {
        value: parsedWeight,
        date: formattedDateTime,
      })
    } else {
      await addWeight({
        value: parsedWeight,
        date: formattedDateTime,
      })
    }
    closeModal()
  } catch (error) {
    errorMessage.value = 'Failed to save weight. Try again.'
    console.error(error)
  } finally {
    loading.value = false
    await fetchWeights()
  }
}

async function loadLastWeight() {
  try {
    const lastWeightData = await lastRegister()
    weight.value = lastWeightData ? lastWeightData.weight : null
  } catch (error) {
    console.error('Error fetching last weight:', error)
    weight.value = null
  }
}

async function openModal() {
  if (dialogRef.value) {
    resetModal()
    if (!props.editingEntry) await loadLastWeight()
    dialogRef.value.showModal()
  }
}

function closeModal() {
  if (dialogRef.value) {
    dialogRef.value.close()
  }
  errorMessage.value = ''
}

function resetModal() {
  weight.value = null
  date.value = new Date().toISOString().slice(0, 10)
  time.value = new Date().toTimeString().slice(0, 5)
  errorMessage.value = ''
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="app-surface m-auto w-[calc(100%-2rem)] max-w-[440px] overflow-hidden p-0 text-slate-700 backdrop:bg-slate-950/35"
    @close="closeModal"
    @click="(e) => e.target === dialogRef && closeModal()"
  >
    <form class="w-full p-5 sm:p-6" @submit.prevent="handleSubmit" @click.stop>
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">
            {{ editingEntry ? 'Edit register' : 'Add register' }}
          </h2>
          <p class="mt-1 text-xs text-slate-400">Keep it simple. One calm entry at a time.</p>
        </div>
        <button
          type="button"
          class="icon-button -mr-2 -mt-2"
          :disabled="loading"
          aria-label="Close"
          @click="closeModal"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label for="weight" class="form-label">
            Weight
          </label>
          <div class="relative">
            <input
              id="weight"
              v-model="weight"
              type="number"
              step="0.1"
              min="0"
              class="form-input pr-14 text-3xl font-semibold tabular-nums"
              placeholder="Weight"
              required
            />
            <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-400">
              kg
            </span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label for="date" class="form-label">
              Date
            </label>
            <input
              id="date"
              v-model="date"
              type="date"
              class="form-input"
              required
            />
          </div>
          <div>
            <label for="time" class="form-label">
              Time
            </label>
            <input
              id="time"
              v-model="time"
              type="time"
              class="form-input"
              required
            />
          </div>
        </div>
        <p v-if="errorMessage" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <button
          class="btn-secondary"
          type="button"
          :disabled="loading"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : editingEntry ? 'Update register' : 'Add register' }}
        </button>
      </div>
    </form>
  </dialog>
</template>
