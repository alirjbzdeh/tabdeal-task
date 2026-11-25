import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/i18n'],

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
  // Rubik has no Persian glyphs, so Vazirmatn covers the `fa` locale. Fonts are split by
  // unicode-range, so English pages never download the Persian font (and vice versa).
  fonts: {
    families: [
      { name: 'Rubik', provider: 'google', weights: [400, 500, 700], subsets: ['latin'] },
      { name: 'Vazirmatn', provider: 'google', weights: [400, 500, 700], subsets: ['arabic'] },
    ],
  },

  // English (default, no URL prefix) and Persian (/fa, right-to-left).
  // A URL prefix instead of cookie/browser detection keeps every page cacheable (SWR) and
  // crawlable, and each language gets its own hreflang link.
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://tabdeal-task.vercel.app',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    // Skip vue-i18n's global components (<i18n-t> etc.); we only use $t / useI18n.
    // The message compiler has to stay: the module sends messages to the browser as strings.
    bundle: { fullInstall: false },
    locales: [
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'fa', language: 'fa-IR', name: 'فارسی', dir: 'rtl', file: 'fa.json' },
    ],
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
    '/fa': { swr: 3600 },
    '/character/**': { swr: 86400 },
    '/fa/character/**': { swr: 86400 },
  },

  app: {
    head: {
      // lang/dir, title and description come from the active locale (app.vue).
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
