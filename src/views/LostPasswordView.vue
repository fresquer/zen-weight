<template>
  <div class="auth-shell">
    <div class="auth-panel">
      <div class="auth-title">zen weight</div>
      <form @submit.prevent="handlePasswordRecovery" class="app-surface w-full p-6 sm:p-8">
        <div class="mb-4">
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="Email"
            required
          />
        </div>
        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="mb-4 rounded-lg bg-lime-50 px-3 py-2 text-sm text-lime-700"
        >
          {{ successMessage }}
        </div>
        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Reset Password' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-4">
        <router-link to="/login" class="text-sm text-slate-500 hover:text-slate-700">
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
