/**
 * `$fetch` pointed at the Rick and Morty API. The API rate-limits (429), so requests retry a few
 * times before giving up (ofetch only retries 408/409/425/429/5xx, never a 404).
 */
export function useApi() {
  const { apiBase } = useRuntimeConfig().public
  return $fetch.create({ baseURL: apiBase, retry: 3, retryDelay: 500 })
}
