<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <!-- The brand name is a logo: always written in Latin, like on the show. -->
  <NuxtLink
    :to="localePath('/')"
    dir="ltr"
    class="inline-flex h-9 items-center rounded font-bold tracking-tight text-info focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
  >
    <!-- TODO: swap for the exported Figma logo (public/logo.png, 116x36). -->
    <span class="text-lg leading-none">Rick <span class="text-accent">and</span> Morty</span>
    <!-- Extra context for screen readers; the visible name stays first so voice control
         ("click Rick and Morty") still matches. -->
    <span class="sr-only">, {{ $t('app.home') }}</span>
  </NuxtLink>
</template>
