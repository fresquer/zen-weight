<script setup>
import { ref, watch } from 'vue'
import { useWeightStore } from '@/services/useWeightTracker'

const { addWeight, editWeight, fetchWeights } = useWeightStore()

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

// Watch para actualizar los valores cuando cambia editingEntry
watch(
  () => props.editingEntry,
  (newValue) => {
    if (newValue) {
      weight.value = newValue.value
      date.value = newValue.date
        ? newValue.date.split('T')[0]
        : new Date().toISOString().slice(0, 10)
      time.value = newValue.date
        ? newValue.date.split('T')[1].slice(0, 5)
        : new Date().toTimeString().slice(0, 5)
    } else {
      weight.value = null
      date.value = new Date().toISOString().slice(0, 10)
      time.value = new Date().toTimeString().slice(0, 5)
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!weight.value || !date.value || !time.value) {
    errorMessage.value = 'Please enter a valid weight, date, and time.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const formattedDateTime = `${date.value}T${time.value}:00`

    if (props.editingEntry) {
      await editWeight(props.editingEntry.id, {
        value: parseFloat(weight.value),
        date: formattedDateTime,
      })
    } else {
      await addWeight({
        value: parseFloat(weight.value),
        date: formattedDateTime,
      })
    }
    closeModal()
  } catch (error) {
    errorMessage.value = 'Failed to save weight. Try again.'
    console.error(error)
  } finally {
    loading.value = false
    fetchWeights()
  }
}

function openModal() {
  if (dialogRef.value) {
    resetModal()
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
  <dialog ref="dialogRef" class="modal w-md bg-white p-8 shadow mx-auto mt-8" @close="closeModal">
    <form class="modal-box w-full max-w-md" @submit.prevent="handleSubmit">
      <div class="modal-header">
        <h3 class="text-lg font-bold">{{ editingEntry ? 'Edit Weight' : 'Register Weight' }}</h3>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <label for="weight" class="label">
          <span class="label-text">Weight</span>
        </label>
        <input
          id="weight"
          v-model="weight"
          type="number"
          step="0.1"
          class="input input-bordered w-full"
          placeholder="Weight"
          required
        />

        <label for="date" class="label mt-4">
          <span class="label-text">Date</span>
        </label>
        <input id="date" v-model="date" type="date" class="input input-bordered w-full" required />

        <label for="time" class="label mt-4">
          <span class="label-text">Time</span>
        </label>
        <input id="time" v-model="time" type="time" class="input input-bordered w-full" required />

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <div class="modal-footer mt-4">
        <button
          class="btn btn-primary cursor-pointer px-8 py-1 bg-amber-400"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : editingEntry ? 'Save' : 'Register' }}
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
