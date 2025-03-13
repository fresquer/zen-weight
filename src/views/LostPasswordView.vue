<template>
  <div class="flex flex-col items-center h-screen pt-16 md:pt-32 px-4">
    <div class="w-full md:w-[400px]">
      <div class="text-3xl md:text-5xl mb-8 text-center font-light">zen weight</div>
      <form @submit.prevent="handlePasswordRecovery" class="bg-white p-8 rounded-xl shadow w-full">
        <div class="mb-4">
          <input
            id="email"
            v-model="email"
            type="email"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="Email"
            required
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div v-if="successMessage" class="text-green-500 mb-4">{{ successMessage }}</div>
        <div>
          <button
            type="submit"
            class="btn btn-primary w-full bg-slate-500 hover:bg-slate-600 cursor-pointer rounded-xl text-white py-2 px-4 shadow"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Reset Password' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-4">
        <router-link to="/login" class="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/services/useAuth'

const { resetPassword } = useAuth()

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handlePasswordRecovery = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await resetPassword(email.value)
    successMessage.value = 'Password reset instructions have been sent to your email'
  } catch (error) {
    errorMessage.value = 'Error sending reset instructions. Please try again.'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
