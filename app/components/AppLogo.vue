<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

const home = computed(() => localePath('/'))
const isCurrent = computed(() => route.fullPath === home.value)
</script>

<template>
  <NuxtLink v-slot="{ href, navigate }" :to="home" custom>
    <a
      :href="href ?? undefined"
      :aria-current="isCurrent ? 'page' : undefined"
      dir="ltr"
      class="inline-flex rounded focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      @click="navigate"
    >
      <img
        src="/logo.webp"
        srcset="/logo.webp 1x, /logo@2x.webp 2x"
        width="116"
        height="36"
        alt="Rick and Morty"
        decoding="async"
        class="h-9 w-29"
      />
      <span class="sr-only">, {{ $t('app.home') }}</span>
    </a>
  </NuxtLink>
</template>
