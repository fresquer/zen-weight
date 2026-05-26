import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      'supabase/volumes/db/data/**',
      'supabase/volumes/storage/**',
      'supabase/volumes/snippets/**',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
]
