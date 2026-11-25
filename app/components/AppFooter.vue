<template>
  <footer class="mt-auto border-t border-line">
    <div class="container-page py-6 text-sm text-muted">
      <p>
        {{ $t('footer.credit') }}
        <a
          href="https://rickandmortyapi.com"
          rel="noopener"
          class="rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {{ $t('footer.api') }}
        </a>
      </p>
    </div>
  </footer>
</template>
