<script setup>
import { ref } from 'vue'
import { useWeight } from '@/services/useWeightTracker'

const { addWeight } = useWeight()

const weight = ref(null)
const date = ref(new Date().toISOString().slice(0, 10)) // Fecha actual por defecto
const dialogRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// 🔹 Registrar el peso en Supabase
async function registerWeight() {
  if (!weight.value || !date.value) {
    errorMessage.value = 'Please enter a valid weight and date.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await addWeight({ value: weight.value, date: date.value }) // Usamos el composable
    weight.value = null
    date.value = new Date().toISOString().slice(0, 10) // Resetear fecha a hoy
    closeModal()
  } catch (error) {
    errorMessage.value = 'Failed to register weight. Try again.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 🔹 Abrir el modal
function openModal() {
  if (dialogRef.value) {
    dialogRef.value.showModal()
  }
}

// 🔹 Cerrar el modal
function closeModal() {
  if (dialogRef.value) {
    dialogRef.value.close()
  }
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <dialog ref="dialogRef" class="modal w-md bg-white p-8 shadow mx-auto mt-8" @close="closeModal">
    <form class="modal-box w-full max-w-md" @submit.prevent="registerWeight">
      <div class="modal-header">
        <h3 class="text-lg font-bold">Register Weight</h3>
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

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <div class="modal-footer mt-4">
        <button
          class="btn btn-primary cursor-pointer px-8 py-1 bg-amber-400"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Register' }}
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
