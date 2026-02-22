import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default mergeConfig(
  defineViteConfig({
    plugins: [react()],
  }),
  defineVitestConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    },
  })
)
