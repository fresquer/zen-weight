<template>
  <div class="flex flex-col items-center h-screen pt-16 md:pt-32 px-4">
    <div>
      <div class="text-4xl md:text-6xl font-bold mb-16">Zen Weight</div>
      <form @submit.prevent="handleRegister">
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
        <div class="mb-4">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div>
          <button
            type="submit"
            class="btn btn-primary w-full bg-green-500 hover:bg-green-600 cursor-pointer rounded-xl text-white py-2 px-4 shadow"
            :disabled="loading"
          >
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </div>
      </form>
      <p class="mt-4 text-sm text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
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
