<template>
  <div class="auth-shell">
    <div class="auth-panel">
      <div class="auth-title">zen weight</div>
      <form @submit.prevent="handleLogin" class="app-surface w-full p-6 sm:p-8">
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
        <div class="mb-4">
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Password"
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
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-4">
        <router-link to="/lost-password" class="text-sm text-slate-500 hover:text-slate-700">
          Forgot your password?
        </router-link>
      </div>
      <hr class="my-4 mx-auto w-1/2 border-slate-200" />
      <p class="mt-4 text-center text-sm text-slate-500">
        Don't have an account?
        <router-link to="/register" class="font-semibold text-slate-700 underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/useAuth' // Importamos el composable de autenticación

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

// 🔹 Manejo del login
const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    router.push('/app') // Redirige al dashboard
  } catch (error) {
    errorMessage.value = 'Invalid email or password'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
