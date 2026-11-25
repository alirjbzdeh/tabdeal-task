<script setup lang="ts">
const { t } = useI18n()

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
  <div class="flex min-h-dvh flex-col bg-base">
    <a
      href="#main"
      class="sr-only rounded bg-accent px-4 py-2 font-medium text-on-accent focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50"
    >
      {{ $t('app.skip') }}
    </a>
    <slot />
    <AppFooter />
  </div>
</template>
