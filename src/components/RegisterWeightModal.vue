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
}

function resetModal() {
  weight.value = null
  date.value = new Date().toISOString().slice(0, 10)
  time.value = new Date().toTimeString().slice(0, 5)
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="modal w-md bg-white p-8 shadow mx-auto mt-8"
    @close="closeModal"
    @click="(e) => e.target === dialogRef && closeModal()"
  >
    <form class="modal-box w-full max-w-md" @submit.prevent="handleSubmit" @click.stop>
      <div class="modal-body space-y-4 mb-6">
        <div class="border-b border-slate-200 pb-1">
          <label for="weight" class="label">
            <span class="label-text text-slate-500">Weight</span>
          </label>
          <div class="flex items-center">
            <input
              id="weight"
              v-model="weight"
              type="number"
              step="0.1"
              min="0"
              class="input input-bordered w-full focus:outline-none text-3xl pr-12"
              placeholder="Weight"
              required
            />
            <span class="text-slate-500 text-2xl -ml-10">kg</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div class="border-b border-slate-200 pb-1">
            <label for="date" class="label mt-4">
              <span class="label-text text-slate-500">Date</span>
            </label>
            <input
              id="date"
              v-model="date"
              type="date"
              class="input input-bordered w-full focus:outline-none"
              required
            />
          </div>
          <div class="border-b border-slate-200 pb-1">
            <label for="time" class="label mt-4">
              <span class="label-text text-slate-500">Time</span>
            </label>
            <input
              id="time"
              v-model="time"
              type="time"
              class="input input-bordered w-full focus:outline-none"
              required
            />
          </div>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <div class="modal-footer mt-4 grid grid-cols-2 gap-4">
        <button
          class="block cursor-pointer text-sm text-slate-600"
          type="button"
          :disabled="loading"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          class="block btn-primary cursor-pointer px-8 py-2 bg-slate-700 hover:bg-slate-800 text-sm text-slate-100 rounded-full whitespace-nowrap"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : editingEntry ? 'Update register' : 'Add register' }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<style>
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
