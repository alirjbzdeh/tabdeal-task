<!--
  The dark gradient band under the header (search bar on the home page, character hero on the
  detail page). It's a separate element from <header> so the detail hero can live inside <main>.
-->
<template>
  <div class="relative isolate overflow-hidden border-b-4 border-base bg-hero">
    <div class="container-page relative">
      <AppGlow class="-top-15" />
      <slot />
    </div>
  </div>
</template>
