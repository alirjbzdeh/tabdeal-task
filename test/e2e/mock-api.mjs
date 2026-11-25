// Tiny stand-in for the Rick and Morty API, used by the E2E tests.
// The real API is public and rate-limited, so tests that hit it are flaky.
// Run: node test/e2e/mock-api.mjs   (PORT, default 3101)
import { createServer } from 'node:http'

const PORT = Number(process.env.PORT ?? 3101)
const ORIGIN = `http://localhost:${PORT}`
const PAGE_SIZE = 20
const TOTAL = 826

const api = (path) => `${ORIGIN}/api${path}`
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

// Locations. Residents are included on purpose: the app must strip them from its payload.
const locations = [
  [1, 'Earth (C-137)', 'Planet', 'Dimension C-137'],
  [2, 'Abadango', 'Cluster', 'unknown'],
  [3, 'Citadel of Ricks', 'Space station', 'unknown'],
  [4, 'Bird World', 'Planet', 'unknown'],
].map(([id, name, type, dimension]) => ({
  id,
  name,
  type,
  dimension,
  residents: range(1, 50).map((r) => api(`/character/${r}`)),
  url: api(`/location/${id}`),
  created: '2017-11-10T12:42:04.162Z',
}))
const place = (id) => ({ name: locations[id - 1].name, url: api(`/location/${id}`) })
const UNKNOWN_PLACE = { name: 'unknown', url: '' }

// 51 episodes, 10 per season. The first two have real names to assert on.
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
const episodes = range(1, 51).map((id) => {
  const season = Math.ceil(id / 10)
  const number = id - (season - 1) * 10
  const named = { 1: ['Pilot', 'December 2, 2013'], 2: ['Lawnmower Dog', 'December 9, 2013'] }
  const [name, air_date] = named[id] ?? [
    `Test Episode ${id}`,
    `${months[id % 8]} ${(id % 28) + 1}, ${2013 + season}`,
  ]
  return {
    id,
    name,
    air_date,
    episode: `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`,
    characters: range(1, 20).map((c) => api(`/character/${c}`)),
    url: api(`/episode/${id}`),
    created: '2017-11-10T12:56:33.798Z',
  }
})
const episodeUrls = (ids) => ids.map((id) => api(`/episode/${id}`))

// [name, status, species, type, origin, location, episode ids]
const known = [
  ['Rick Sanchez', 'Alive', 'Human', '', place(1), place(3), range(1, 51)],
  ['Morty Smith', 'Alive', 'Human', '', UNKNOWN_PLACE, place(3), range(1, 51)],
  ['Summer Smith', 'Alive', 'Human', '', place(1), place(1), range(6, 51)],
  ['Beth Smith', 'Alive', 'Human', '', place(1), place(1), range(6, 51)],
  ['Jerry Smith', 'Alive', 'Human', '', place(1), place(1), range(6, 51)],
  // Same origin and location: one location card.
  ['Birdperson', 'Dead', 'Bird-Person', '', place(4), place(4), [11, 22]],
  // Single episode (the API returns an object, not an array) and no known places.
  ['Squanchy', 'unknown', 'unknown', 'Cat-Person', UNKNOWN_PLACE, UNKNOWN_PLACE, [16]],
]
const statuses = ['Alive', 'Dead', 'unknown']

const characters = Array.from({ length: TOTAL }, (_, i) => {
  const id = i + 1
  const [name, status, species, type, origin, location, episodeIds] = known[i] ?? [
    `Test Character ${id}`,
    statuses[id % 3],
    'Alien',
    '',
    place(2),
    place(3),
    [1, 2],
  ]
  return {
    id,
    name,
    status,
    species,
    type,
    gender: 'Male',
    origin,
    location,
    image: `${ORIGIN}/avatar/${id}.svg`,
    episode: episodeUrls(episodeIds),
    url: api(`/character/${id}`),
    created: '2017-11-04T18:48:46.250Z',
  }
})

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'content-type': type, 'access-control-allow-origin': '*' })
  res.end(type === 'application/json' ? JSON.stringify(body) : body)
}

function listCharacters(url, res) {
  const name = (url.searchParams.get('name') ?? '').toLowerCase()
  const page = Number(url.searchParams.get('page') ?? 1)
  const matches = name ? characters.filter((c) => c.name.toLowerCase().includes(name)) : characters
  const pages = Math.ceil(matches.length / PAGE_SIZE)
  if (!matches.length || page < 1 || page > pages) {
    return send(res, 404, { error: 'There is nothing here' })
  }
  const link = (p) => {
    const q = new URLSearchParams({ page: String(p), ...(name ? { name } : {}) })
    return `${ORIGIN}/api/character?${q}`
  }
  send(res, 200, {
    info: {
      count: matches.length,
      pages,
      next: page < pages ? link(page + 1) : null,
      prev: page > 1 ? link(page - 1) : null,
    },
    results: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  })
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', ORIGIN)
  const path = url.pathname.replace(/\/$/, '')

  if (path === '/api/character') return listCharacters(url, res)

  // /api/{character|episode|location}/1 -> object, /api/.../1,2,3 -> array (like the real API).
  const byId = /^\/api\/(character|episode|location)\/([\d,]+)$/.exec(path)
  if (byId) {
    const [, resource, ids] = byId
    const all = { character: characters, episode: episodes, location: locations }[resource]
    const found = ids
      .split(',')
      .map(Number)
      .map((id) => all[id - 1])
      .filter(Boolean)
    if (!ids.includes(',')) {
      return found[0]
        ? send(res, 200, found[0])
        : send(res, 404, { error: `${resource} not found` })
    }
    return send(res, 200, found)
  }

  const avatar = /^\/avatar\/(\d+)\.svg$/.exec(path)
  if (avatar) {
    const hue = (Number(avatar[1]) * 47) % 360
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="hsl(${hue} 45% 45%)"/></svg>`
    return send(res, 200, svg, 'image/svg+xml')
  }

  if (path === '/health') return send(res, 200, { ok: true })
  send(res, 404, { error: 'Not found' })
}).listen(PORT, () => console.log(`Mock API on ${ORIGIN}`))
