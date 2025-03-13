<script setup>
import { ref } from 'vue'
import RegisterWeightModal from '@/components/RegisterWeightModal.vue'

const modal = ref(null)
const openModal = () => {
  modal.value.openModal()
}
</script>
<template>
  <div>
    <RegisterWeightModal ref="modal" />
    <main class="max-w-[550px] mx-auto pt-8 p-4 space-y-4">
      <header class="flex justify-between items-center">
        <h1 class="text-2xl text-gray-700">zen weight</h1>
        <div class="flex items-center gap-3 cursor-pointer group" @click="openModal">
          <span
            class="bg-slate-300 text-gray-600 group-hover:shadow transition-colors duration-200 py-[1px] px-[8px] rounded block leading-[22px] font-bold"
          >
            +
          </span>
          <p class="text-gray-600 text-sm">add register</p>
        </div>
      </header>
      <router-view />
      <!-- Aquí se mostrarán las rutas hijas -->
    </main>
  </div>
</template>
