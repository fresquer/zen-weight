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
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-normal text-slate-400">Logged as</p>
        <p class="mt-1 truncate text-sm font-semibold text-slate-700">{{ userEmail }}</p>
      </div>
      <button type="button" class="btn-secondary border-red-100 text-red-500 hover:bg-red-50" @click="logOut">
        Log out
      </button>
    </div>
  </BaseTile>
</template>
