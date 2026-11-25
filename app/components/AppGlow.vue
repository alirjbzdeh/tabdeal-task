<!--
  Lime glow behind the logo. A radial gradient is much cheaper to paint than a big CSS blur.
  The header and the band under it each draw it at the same page position (the band shifts it up
  by the header height), so it looks like one glow while the two stay separate landmarks.
-->
<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute left-16 -z-10 h-[340px] w-[460px] md:left-24"
    style="
      background: radial-gradient(
        closest-side,
        rgb(178 223 40 / 0.55),
        rgb(178 223 40 / 0.18) 45%,
        transparent
      );
    "
  />
</template>
