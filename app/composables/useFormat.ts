/** Numbers and dates in the active language (Persian digits and calendar on /fa). */
export function useFormat() {
  const { localeProperties } = useI18n()
  const language = computed(() => localeProperties.value.language ?? 'en-US')

  return {
    number: (value: number) => new Intl.NumberFormat(language.value).format(value),
    /** "December 2, 2013" from an ISO date; the date is read in UTC so it never shifts a day. */
    date: (iso: string) =>
      new Intl.DateTimeFormat(language.value, { dateStyle: 'long', timeZone: 'UTC' }).format(
        new Date(`${iso}T00:00:00Z`),
      ),
  }
}
