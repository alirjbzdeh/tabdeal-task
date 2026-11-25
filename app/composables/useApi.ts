export const API_TIMEOUT = 10_000

export function useApi() {
  const { apiBase } = useRuntimeConfig().public
  return $fetch.create({ baseURL: apiBase, retry: 3, retryDelay: 500 })
}
