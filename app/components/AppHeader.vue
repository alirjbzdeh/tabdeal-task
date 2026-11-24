<!-- Dark gradient header with the logo and the lime glow. Page content (search bar, hero) goes in the slot. -->
<template>
  <header
    class="relative isolate overflow-hidden border-b-4 border-base bg-linear-to-r from-base to-base-dark"
  >
    <div class="container-page relative">
      <!-- Lime glow: a radial gradient is much cheaper to paint than a big CSS blur. -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute top-0 left-16 -z-10 h-[340px] w-[460px] md:left-24"
        style="
          background: radial-gradient(
            closest-side,
            rgb(178 223 40 / 0.55),
            rgb(178 223 40 / 0.18) 45%,
            transparent
          );
        "
      />
      <div class="flex h-15 items-center">
        <AppLogo />
      </div>
      <div class="pt-3 pb-6 md:pt-7">
        <slot />
      </div>
    </div>
  </header>
</template>
