<!--
  Lime glow behind the logo (the `bg-glow` utility in main.css).
  The header and the band under it each draw it at the same page position (the band shifts it up
  by the header height), so it looks like one glow while the two stay separate landmarks.
-->
<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute start-16 -z-10 h-85 w-115 bg-glow md:start-24"
  />
</template>
