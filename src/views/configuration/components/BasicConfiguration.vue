<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import BaseTile from '@/components/BaseTile.vue'
import { useAuth } from '@/services/useAuth'
import { useUserSettings } from '@/services/useUserSettings'

const auth = useAuth()
const { settings, updateSettings } = useUserSettings()

const userEmail = computed(() => {
  return auth.user.value?.email || 'Unknown User'
})

onMounted(async () => {
  await auth.checkSession()
})

const logOut = () => {
  auth.logout()
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
