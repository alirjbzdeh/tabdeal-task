export function useFormat() {
  const { localeProperties } = useI18n()
  const language = computed(() => localeProperties.value.language ?? 'en-US')

  return {
    number: (value: number) => new Intl.NumberFormat(language.value).format(value),
    date: (iso: string) =>
      new Intl.DateTimeFormat(language.value, { dateStyle: 'long', timeZone: 'UTC' }).format(
        new Date(`${iso}T00:00:00Z`),
      ),
  }
}
