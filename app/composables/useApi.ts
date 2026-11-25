export function useApi() {
  return $fetch.create({ baseURL: '/api', retry: 0 })
}
