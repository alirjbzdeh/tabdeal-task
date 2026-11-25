import { parseName, parsePage } from '#shared/utils/query'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return getCharacterPage(parseName(query.name), parsePage(query.page))
})
