export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid character id' })
  }

  const detail = await getCharacterDetail(id)
  if (!detail) throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  return detail
})
