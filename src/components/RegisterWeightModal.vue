<script setup>
import { ref, watch, onMounted } from 'vue'
import { useWeightStore } from '@/services/useWeightTracker'

const { addWeight, editWeight, fetchWeights, lastRegister } = useWeightStore()

onMounted(async () => {
  try {
    await fetchWeights()
  } catch (error) {
    console.error('Error loading initial weights:', error)
  }
})

watch(lastRegister, (newValue) => {
  console.log('🚀 ~ watch ~ newValue:', newValue)
  if (newValue) {
    weight.value = newValue.weight
  }
  console.log('🚀 ~ lastRegister:', lastRegister.value)
})

const props = defineProps({
  editingEntry: {
    type: Object,
    default: null,
  },
})

const weight = ref(lastRegister)
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
  <dialog
    ref="dialogRef"
    class="modal w-md bg-white p-8 shadow mx-auto mt-8"
    @close="closeModal"
    @click="(e) => e.target === dialogRef && closeModal()"
  >
    <form class="modal-box w-full max-w-md" @submit.prevent="handleSubmit" @click.stop>
      <div class="modal-body space-y-4 mb-6">
        <div>
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
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="date" class="label mt-4">
              <span class="label-text">Date</span>
            </label>
            <input
              id="date"
              v-model="date"
              type="date"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label for="time" class="label mt-4">
              <span class="label-text">Time</span>
            </label>
            <input
              id="time"
              v-model="time"
              type="time"
              class="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <div class="modal-footer mt-4 grid grid-cols-2 gap-4">
        <button
          class="block cursor-pointer text-sm text-slate-600"
          type="submit"
          :disabled="loading"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          class="block btn-primary cursor-pointer px-8 py-1 bg-slate-700 text-sm text-slate-100 rounded-full"
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
