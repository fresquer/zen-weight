<template>
  <div class="flex flex-col items-center h-screen pt-16 md:pt-32 px-4">
    <div>
      <div class="text-4xl md:text-6xl font-bold mb-16">Zen Weight</div>
      <form @submit.prevent="handleLogin">
        <div class="mb-2">
          <input
            id="email"
            v-model="email"
            type="email"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-4">
          <input
            id="password"
            v-model="password"
            type="password"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="Password"
            required
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div>
          <button
            type="submit"
            class="btn btn-primary w-full bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-xl text-white py-2 px-4 shadow"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <p class="mt-4 text-sm text-center">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
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
