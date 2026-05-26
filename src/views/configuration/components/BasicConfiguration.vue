<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseTile from '@/components/BaseTile.vue'
import { useAuth } from '@/services/useAuth'

const auth = useAuth()
const router = useRouter()

const userEmail = computed(() => {
  return auth.user.value?.email || 'Unknown User'
})

onMounted(async () => {
  await auth.checkSession()
})

const logOut = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <BaseTile>
    <div class="p-4">
      <div class="flex justify-between items-center">
        <p><b>Logged as:</b> {{ userEmail }}</p>
        <p class="text-red-400 cursor-pointer" @click="logOut">Log out</p>
      </div>
    </div>
  </BaseTile>
</template>
