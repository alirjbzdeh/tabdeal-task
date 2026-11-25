# Rick and Morty characters

A server-rendered character browser built with Nuxt 4 and Tailwind CSS v4, using the public
[Rick and Morty API](https://rickandmortyapi.com/documentation).

**Live demo:** https://tabdeal-task.vercel.app

- Home page: every character in a paginated grid, with search by name across all characters.
- Detail page: description, key facts, every episode the character appears in, and both origin
  and current location.
- Both pages are fully server-rendered (data included), responsive, and match the Figma design.
- English and Persian (`/fa`, right-to-left, Persian digits and calendar).
- Lighthouse 97–100 in all four categories on mobile and desktop.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

| Variable               | Default                           | Used for                                    |
| ---------------------- | --------------------------------- | ------------------------------------------- |
| `NUXT_API_BASE`        | `https://rickandmortyapi.com/api` | Upstream API (server only, read at runtime) |
| `NUXT_PUBLIC_SITE_URL` | `https://tabdeal-task.vercel.app` | Canonical and `hreflang` links (build time) |

## Scripts

| Script             | What it does                                                 |
| ------------------ | ------------------------------------------------------------ |
| `npm run dev`      | Dev server with HMR                                          |
| `npm run build`    | Production build (`node .output/server/index.mjs` to run it) |
| `npm run check`    | Lint, format check, typecheck and unit tests with coverage   |
| `npm test`         | Unit and component tests (Vitest)                            |
| `npm run test:e2e` | End-to-end tests (Playwright, desktop and mobile)            |
| `npm run lint:fix` | ESLint with fixes                                            |
| `npm run format`   | Prettier                                                     |

A pre-commit hook (simple-git-hooks + lint-staged) lints and formats staged files.

## Project structure

```
app/
  pages/          index (list + search) and character/[id] (detail)
  components/     UI pieces (cards, header, search, pagination, state messages, icons)
  composables/    useCharacters, useCharacterDetail, useApi, useApiError, useFormat
  utils/          pure helpers for the UI (status line, dates, pagination, error kinds)
  layouts/        shared layout: <html lang dir>, hreflang, titles, skip link, footer
  error.vue       translated 404 / error page
  assets/css/     Tailwind theme: every color, gradient and size used by the app
server/
  api/            /api/characters and /api/characters/:id (cached proxy to the upstream API)
  utils/          upstream client (timeouts, retries, error mapping) and cached loaders
  plugins/        Content-Security-Policy header
shared/
  types/          upstream API types and the trimmed models sent to the browser
  utils/          mappers, query parsing and URL helpers used by both app and server
i18n/locales/     en.json and fa.json (keys kept in sync)
test/
  unit/           pure logic (Vitest, node)
  nuxt/           components in a Nuxt environment (Vitest)
  e2e/            Playwright specs and a local mock API
```

## How data flows

```
page ──useAsyncData──▶ /api/characters[/:id] ──cached function──▶ rickandmortyapi.com
```

- Pages fetch with `useAsyncData` during SSR, so the HTML already contains the data. On the client,
  stale requests are cancelled through the handler's `signal` (typing a new search, changing page,
  leaving the page) and every request has a timeout.
- The browser never calls the upstream API directly. The Nitro routes trim the payload to what the
  UI renders, combine character + episodes + locations into one response for the detail page, and
  cache results (`defineCachedFunction`, stale-while-revalidate). This keeps the rate-limited
  upstream out of the user's path and gives one place to change the backend.
- Upstream calls retry only on the server, with exponential backoff that honours `Retry-After`,
  and map failures to proper status codes (404, 429, 502, 504).
- Errors are classified once (`classifyApiError`) and shown through `useApiError` as a translated
  title, message and retry button. A failed server render answers 503.

## Decisions worth knowing

- **Caching:** pages use `swr` route rules (ISR on Vercel). The list routes declare
  `allowQuery: ['name', 'page']`, otherwise Vercel would serve page 1 for every page and search.
- **Header:** `<AppHeader>` (the banner landmark) and `<HeroBand>` (the gradient band holding the
  search or the detail hero) are separate so the detail hero can live inside `<main>`. Both draw
  the same `<AppGlow>` at the same page position, so it reads as one glow.
- **Figma values** were measured from the view-only file; the gradient stops and the glow blur were
  matched by comparing rendered pixels with the design. An E2E test (`figma.spec.ts`) guards the
  header geometry at 1920 and 360 widths.
- **Styling:** no inline styles or arbitrary Tailwind values; every color, gradient and odd size
  is a token or utility in `main.css`. Layout uses logical properties (`ps-`, `start-`) so RTL
  works without overrides.
- **Pagination and logo links** use `NuxtLink custom`, because vue-router ignores the query when
  marking the active link and would otherwise mark every page link as current.
- **Search** is debounced; Enter or the button searches immediately. It also works without
  JavaScript (a plain GET form), and text typed before hydration is picked up.
- **LCP:** the first row of cards loads eagerly at high priority and the first image is preloaded.
  `payloadExtraction` is off so a `_payload.json` request doesn't compete with it, CSS is inlined,
  and prefetching happens on interaction only.
- **Fonts:** Rubik and Vazirmatn are self-hosted by `@nuxt/fonts`. Persian pages use Vazirmatn
  first, with Rubik for Latin names; Vazirmatn has no metric fallbacks, which would otherwise catch
  Latin text. English pages never download the Persian font.
- **i18n:** the vue-i18n message compiler stays in the bundle, because @nuxtjs/i18n v10 loads
  locale files as JSON at runtime; dropping it breaks interpolation after hydration.
- **Security:** CSP (set at runtime from the configured API origin), `nosniff`, frame denial,
  referrer and permissions policies.

## Testing

- `npm test`: unit and component tests (Vitest). `npm run test:coverage` enforces thresholds.
- `npm run test:e2e`: builds the app and runs Playwright on desktop and mobile against a local mock
  API (`test/e2e/mock-api.mjs`), which also simulates 400/429/500 errors (`__400`, `__429`,
  `__500` searches) and slow responses (searches starting with `slow`).
- CI (GitHub Actions) runs `npm run check` and the E2E suite on every push and pull request.

## Deployment

Deployed on Vercel from `main`. The image provider is picked automatically (`vercel` on Vercel,
`netlify` on Netlify, none locally), so avatars are resized and converted to modern formats by
the host.
