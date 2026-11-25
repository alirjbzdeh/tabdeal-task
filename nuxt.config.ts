import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  // Inline all CSS into the SSR HTML (Tailwind output is small): no render-blocking
  // stylesheet request before first paint.
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

  // On Vercel / Netlify, images go through the host's image CDN (AVIF/WebP, cached at the edge,
  // one origin fetch per image). Both set an env var during the build. Everywhere else they load
  // straight from the API's CDN: proxying them through ipx would hit the API's rate limit
  // (20 avatars per page view).
  image: {
    provider: process.env.VERCEL ? 'vercel' : process.env.NETLIFY ? 'netlify' : 'none',
    domains: ['rickandmortyapi.com'],
    quality: 75,
    // Vercel only resizes to widths listed here: add the ones we render (hero 240, card 300, and
    // their 2x), so it doesn't round them up to 640. Merged with the default breakpoints.
    screens: { hero: 240, card: 300, hero2x: 480, card2x: 600 },
  },

  // API data never changes, so cache rendered pages (stale-while-revalidate).
  // Fewer API calls, faster first byte. Error responses (>= 400) are never cached.
  routeRules: {
    '/': { swr: 3600 },
    '/character/**': { swr: 86400 },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Rick and Morty Characters',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Browse and search every Rick and Morty character, their episodes and locations.',
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

  // No fixed preset: Nitro detects Netlify on their build servers, and local
  // builds stay `node-server` so `npm run preview` and E2E tests work.
  // Prefetch a page when the user is about to open it (hover/focus/touch), not for every
  // link that scrolls into view: 20 cards would mean 20 detail-page renders and API bursts.
  experimental: {
    // With SWR routes Nuxt would also fetch `_payload.json` on first load, competing with
    // the LCP image for bandwidth. The data is already inlined in the HTML.
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
