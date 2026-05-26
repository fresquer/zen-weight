<template>
  <div class="auth-shell">
    <div class="auth-panel">
      <div class="auth-title">zen weight</div>
      <form @submit.prevent="handleRegister" class="app-surface w-full p-6 sm:p-8">
        <div class="mb-3">
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-3">
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Password"
            required
          />
        </div>
        <div class="mb-4">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ errorMessage }}
        </div>
        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </div>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">
        Already have an account?
        <router-link to="/login" class="font-semibold text-slate-700 underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/useAuth'

const { registerUser } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

// 🔹 Manejo del registro
const handleRegister = async () => {
  errorMessage.value = ''
  loading.value = true

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await registerUser(email.value, password.value)
    router.push('/app')
  } catch (error) {
    errorMessage.value = 'Error creating account'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
