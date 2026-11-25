<script setup lang="ts">
const { t } = useI18n()

// <html lang dir>, hreflang alternates and og:locale for the active language.
const i18nHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang, dir: i18nHead.value.htmlAttrs.dir },
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
  titleTemplate: (title?: string) => (title ? `${title} · ${t('app.name')}` : t('app.name')),
}))

useSeoMeta({ description: () => t('app.description') })
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
