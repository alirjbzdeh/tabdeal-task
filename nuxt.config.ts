import tailwindcss from '@tailwindcss/vite'

const imageProvider = process.env.VERCEL ? 'vercel' : process.env.NETLIFY ? 'netlify' : 'none'
const apiBase = process.env.NUXT_API_BASE ?? 'https://rickandmortyapi.com/api'
const apiOrigin = new URL(apiBase).origin

const listCache = { swr: 3600, isr: { expiration: 3600, allowQuery: ['name', 'page'] } }
const detailCache = { swr: 86400 }

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  features: {
    inlineStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    apiBase,
  },

  fonts: {
    families: [
      { name: 'Rubik', provider: 'google', weights: [400, 500, 700], subsets: ['latin'] },
      {
        name: 'Vazirmatn',
        provider: 'google',
        weights: [400, 500, 700],
        subsets: ['arabic'],
        fallbacks: [],
      },
    ],
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://tabdeal-task.vercel.app',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    bundle: { fullInstall: false },
    locales: [
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'fa', language: 'fa-IR', name: 'فارسی', dir: 'rtl', file: 'fa.json' },
    ],
  },

  image: {
    provider: imageProvider,
    domains: ['rickandmortyapi.com'],
    quality: 75,
    screens: { hero: 240, card: 300, hero2x: 480, card2x: 600 },
  },

  routeRules: {
    '/': listCache,
    '/fa': listCache,
    '/character/**': detailCache,
    '/fa/character/**': detailCache,
  },

  $production: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'dark' },
        { name: 'theme-color', content: '#0E0E0E' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ...(imageProvider === 'none'
          ? [{ rel: 'preconnect', href: apiOrigin, crossorigin: '' } as const]
          : []),
      ],
    },
  },

  experimental: {
    payloadExtraction: false,
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },

  nitro: {
    compressPublicAssets: true,
  },
})
