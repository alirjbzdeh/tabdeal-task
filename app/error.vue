<!-- Error page (404 for an unknown character or URL, anything else as a generic error). -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => (notFound.value ? 'Page not found' : 'Something went wrong'))
const text = computed(() =>
  notFound.value
    ? "We couldn't find that character or page. It may have been sucked into a portal."
    : 'An unexpected error happened. Please try again.',
)

useSeoMeta({ title, robots: 'noindex' })

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <AppHeader />
    <main id="main" class="container-page flex-1">
      <StateMessage :level="1" :title="title" :text="text">
        <a
          href="/"
          class="mt-2 inline-flex h-12 items-center rounded bg-accent px-6 font-medium text-on-accent hover:brightness-110"
          @click.prevent="goHome"
        >
          Back to all characters
        </a>
      </StateMessage>
    </main>
  </NuxtLayout>
</template>
