<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const others = computed(() => locales.value.filter((l) => l.code !== locale.value))
</script>

<template>
  <nav :aria-label="$t('app.language')">
    <ul class="flex items-center gap-4">
      <li v-for="other in others" :key="other.code">
        <NuxtLink
          :to="switchLocalePath(other.code)"
          :lang="other.language"
          :hreflang="other.language"
          class="rounded font-system text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {{ other.name }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
