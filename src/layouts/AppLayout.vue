<script setup>
import { ref } from 'vue'
import RegisterWeightModal from '@/components/RegisterWeightModal.vue'

const modal = ref(null)
const openModal = () => {
  modal.value.openModal()
}
</script>
<template>
  <div class="min-h-screen px-3 py-4 sm:px-4 sm:py-8">
    <RegisterWeightModal ref="modal" />
    <main class="mx-auto w-full max-w-[590px] space-y-4">
      <header class="flex items-center justify-between px-1 pb-1">
        <router-link to="/">
          <h1 class="text-2xl font-medium text-slate-700">zen weight</h1>
        </router-link>
        <button
          type="button"
          class="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-white/70 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-lime-100"
          @click="openModal"
        >
          <span
            class="grid h-7 w-7 place-items-center rounded-lg bg-lime-200 text-lg font-bold leading-none text-slate-700 group-hover:bg-lime-300"
          >
            +
          </span>
          <span class="hidden sm:inline">add register</span>
        </button>
      </header>
      <router-view />
      <!-- Aquí se mostrarán las rutas hijas -->
    </main>
  </div>
</template>
