import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

function ensureStorageApiForDevtools() {
  const storage = new Map()

  globalThis.localStorage = {
    get length() {
      return storage.size
    },
    clear() {
      storage.clear()
    },
    getItem(key) {
      return storage.get(String(key)) ?? null
    },
    key(index) {
      return Array.from(storage.keys())[index] ?? null
    },
    removeItem(key) {
      storage.delete(String(key))
    },
    setItem(key, value) {
      storage.set(String(key), String(value))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [vue(), tailwindcss()]

  if (command === 'serve') {
    ensureStorageApiForDevtools()
    const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
    plugins.splice(1, 0, vueDevTools())
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
