// Tiny stand-in for the Rick and Morty API, used by the E2E tests.
// The real API is public and rate-limited, so tests that hit it are flaky.
// Run: node test/e2e/mock-api.mjs   (PORT, default 3101)
import { createServer } from 'node:http'

const PORT = Number(process.env.PORT ?? 3101)
const ORIGIN = `http://localhost:${PORT}`
const PAGE_SIZE = 20
const TOTAL = 826

const known = [
  ['Rick Sanchez', 'Alive', 'Human'],
  ['Morty Smith', 'Alive', 'Human'],
  ['Summer Smith', 'Alive', 'Human'],
  ['Beth Smith', 'Alive', 'Human'],
  ['Jerry Smith', 'Alive', 'Human'],
  ['Birdperson', 'Dead', 'Bird-Person'],
  ['Squanchy', 'unknown', 'unknown'],
]
const statuses = ['Alive', 'Dead', 'unknown']

const characters = Array.from({ length: TOTAL }, (_, i) => {
  const id = i + 1
  const [name, status, species] = known[i] ?? [`Test Character ${id}`, statuses[id % 3], 'Alien']
  return {
    id,
    name,
    status,
    species,
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: `${ORIGIN}/api/location/1` },
    location: { name: 'Citadel of Ricks', url: `${ORIGIN}/api/location/3` },
    image: `${ORIGIN}/avatar/${id}.svg`,
    episode: [`${ORIGIN}/api/episode/1`, `${ORIGIN}/api/episode/2`],
    url: `${ORIGIN}/api/character/${id}`,
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

  const byId = /^\/api\/character\/([\d,]+)$/.exec(path)
  if (byId) {
    const found = byId[1]
      .split(',')
      .map(Number)
      .map((id) => characters[id - 1])
      .filter(Boolean)
    if (!byId[1].includes(',')) {
      return found[0] ? send(res, 200, found[0]) : send(res, 404, { error: 'Character not found' })
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
