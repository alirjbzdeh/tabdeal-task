import type { MaybeRefOrGetter } from 'vue'

export function useApiError(error: MaybeRefOrGetter<unknown>) {
  const { t } = useI18n()

  return computed(() => {
    const value = toValue(error)
    if (!value) return null

    let kind = classifyApiError(value)
    if (kind === 'aborted') return null
    if (import.meta.client && !navigator.onLine) kind = 'network'

    return {
      kind,
      title: t(`errors.${kind}.title`),
      message: t(`errors.${kind}.message`),
      canRetry: kind !== 'badRequest' && kind !== 'notFound',
    }
  })
}
