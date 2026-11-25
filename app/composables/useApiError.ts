import type { MaybeRefOrGetter } from 'vue'

/**
 * Turns an API error into a translated title and message for the UI, picked by what went
 * wrong (rate limit, timeout, offline, server error...). `null` when there's nothing to show,
 * including cancelled requests (a newer search replaced them: not an error for the user).
 */
export function useApiError(error: MaybeRefOrGetter<unknown>) {
  const { t } = useI18n()

  return computed(() => {
    const value = toValue(error)
    if (!value) return null

    let kind = classifyApiError(value)
    if (kind === 'aborted') return null
    // The browser knows best when it's offline.
    if (import.meta.client && !navigator.onLine) kind = 'network'

    return {
      kind,
      title: t(`errors.${kind}.title`),
      message: t(`errors.${kind}.message`),
      canRetry: kind !== 'badRequest' && kind !== 'notFound',
    }
  })
}
