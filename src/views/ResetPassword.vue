<template>
  <div class="flex flex-col items-center h-screen pt-16 md:pt-32 px-4">
    <div class="w-full md:w-[400px]">
      <div class="text-3xl md:text-5xl mb-8 text-center font-light">zen weight</div>
      <form @submit.prevent="handlePasswordReset" class="bg-white p-8 rounded-xl shadow w-full">
        <div class="mb-4">
          <input
            id="password"
            v-model="password"
            type="password"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="New Password"
            required
          />
        </div>
        <div class="mb-4">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="input input-bordered w-full border-1 border-gray-300 p-2 rounded-xl"
            placeholder="Confirm New Password"
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
