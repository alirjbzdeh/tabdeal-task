export function useFormat() {
  const { localeProperties } = useI18n()

  const formatters = computed(() => {
    const language = localeProperties.value.language ?? 'en-US'
    return {
      number: new Intl.NumberFormat(language),
      date: new Intl.DateTimeFormat(language, { dateStyle: 'long', timeZone: 'UTC' }),
    }
  })

  return {
    number: (value: number) => formatters.value.number.format(value),
    date: (iso: string) => formatters.value.date.format(new Date(`${iso}T00:00:00Z`)),
  }
}
