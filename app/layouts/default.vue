<template>
  <div class="flex min-h-dvh flex-col bg-base">
    <a
      href="#main"
      class="sr-only rounded bg-accent px-4 py-2 font-medium text-on-accent focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50"
    >
      {{ $t('app.skip') }}
    </a>
    <slot />
  </div>
</template>
