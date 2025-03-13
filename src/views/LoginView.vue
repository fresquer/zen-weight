<template>
  <div class="flex flex-col items-center h-screen pt-16 md:pt-32 px-4">
    <div class="w-full md:w-[400px]">
      <div class="text-3xl md:text-5xl mb-8 text-center font-light">zen weight</div>
      <form @submit.prevent="handleLogin" class="bg-white p-8 rounded-xl shadow w-full">
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
            class="btn btn-primary w-full bg-slate-500 hover:bg-slate-600 cursor-pointer rounded-xl text-white py-2 px-4 shadow"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-4">
        <router-link to="/lost-password" class="text-sm text-gray-500 hover:text-gray-700">
          Forgot your password?
        </router-link>
      </div>
      <hr class="my-4 text-gray-200 w-1/2 mx-auto" />
      <p class="mt-4 text-sm text-center">
        Don't have an account?
        <router-link to="/register" class="text-slate-700 underline">Register</router-link>
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
