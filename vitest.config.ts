import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

const alias = {
  '~': fileURLToPath(new URL('./app', import.meta.url)),
  '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
}

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: { nuxt: { domEnvironment: 'happy-dom' } },
        },
      }),
    ],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{ts,vue}', 'shared/**/*.ts'],
      exclude: ['shared/types/**'],
      thresholds: { statements: 55, branches: 60, functions: 45, lines: 55 },
    },
  },
})
