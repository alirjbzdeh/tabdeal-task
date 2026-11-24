import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://rickandmortyapi.com/api',
    },
  },

  // Self-hosted Rubik with a metric-matched fallback: no render-blocking
  // third-party CSS, and no layout shift (CLS) when the font swaps in.
  fonts: {
    families: [{ name: 'Rubik', provider: 'google', weights: [400, 500, 700] }],
    defaults: { subsets: ['latin'] },
  },

  // Optimized, modern-format images. On Netlify this uses the Netlify Image CDN.
  image: {
    domains: ['rickandmortyapi.com'],
    format: ['avif', 'webp'],
    quality: 75,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Rick and Morty Characters',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Browse and search every Rick and Morty character, their episodes and locations.',
        },
        { name: 'color-scheme', content: 'dark' },
        { name: 'theme-color', content: '#0E0E0E' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Character images come from this origin; connect early for LCP.
        { rel: 'preconnect', href: 'https://rickandmortyapi.com', crossorigin: '' },
      ],
    },
  },

  nitro: {
    preset: 'netlify',
    compressPublicAssets: true,
  },
})
