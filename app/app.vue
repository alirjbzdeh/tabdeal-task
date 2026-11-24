<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Rick and Morty` : 'Rick and Morty'),
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
