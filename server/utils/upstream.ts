import type { FetchContext } from 'ofetch'

const UPSTREAM_TIMEOUT = 8_000
const MAX_RETRIES = 2
const MAX_RETRY_DELAY = 2_000
const RETRY_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504]

function retryDelay({ response, options }: FetchContext): number {
  const retryAfter = Number(response?.headers.get('retry-after'))
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(retryAfter * 1000, MAX_RETRY_DELAY)
  }
  const attempt = MAX_RETRIES - (Number(options.retry) || 0)
  return Math.min(300 * 2 ** attempt, MAX_RETRY_DELAY)
}

function toHttpError(error: unknown) {
  const { response, name, cause } = (error ?? {}) as {
    response?: { status?: number; statusText?: string }
    name?: string
    cause?: { name?: string }
  }
  if (response?.status) {
    return createError({
      statusCode: response.status,
      statusMessage: response.statusText || 'Upstream error',
    })
  }
  const timedOut = name === 'TimeoutError' || cause?.name === 'TimeoutError'
  return createError({
    statusCode: timedOut ? 504 : 502,
    statusMessage: timedOut ? 'Upstream timeout' : 'Upstream unavailable',
  })
}

export async function fetchUpstream<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  const { apiBase } = useRuntimeConfig()
  try {
    return await $fetch<T>(path, {
      baseURL: apiBase,
      query,
      timeout: UPSTREAM_TIMEOUT,
      retry: MAX_RETRIES,
      retryStatusCodes: RETRY_STATUS_CODES,
      retryDelay,
    })
  } catch (error) {
    const httpError = toHttpError(error)
    if (httpError.statusCode !== 404) console.error(`[upstream] ${path}`, httpError.statusCode)
    throw httpError
  }
}
