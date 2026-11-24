// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(prettier).prepend({
  ignores: ['coverage/**', 'test-results/**', 'playwright-report/**', 'blob-report/**'],
})
