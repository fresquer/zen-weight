<template>
  <div class="auth-shell">
    <div class="auth-panel">
      <div class="auth-title">zen weight</div>
      <form @submit.prevent="handlePasswordReset" class="app-surface w-full p-6 sm:p-8">
        <div class="mb-4">
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="New Password"
            required
          />
        </div>
        <div class="mb-4">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm New Password"
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
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/services/useAuth'
import { useRouter } from 'vue-router'

const { updatePassword } = useAuth()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handlePasswordReset = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await updatePassword(password.value)
    successMessage.value = 'Password updated successfully'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Error updating password. Please try again.'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
