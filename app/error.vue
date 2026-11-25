<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => t(notFound.value ? 'errorPage.notFoundTitle' : 'errorPage.title'))
const text = computed(() => t(notFound.value ? 'errorPage.notFoundText' : 'errorPage.text'))

useSeoMeta({ title, robots: 'noindex' })

const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <NuxtLayout>
    <AppHeader />
    <main id="main" class="container-page flex-1">
      <StateMessage :level="1" :title="title" :text="text">
        <a :href="localePath('/')" class="btn-primary mt-2" @click.prevent="goHome">
          {{ $t('errorPage.back') }}
        </a>
      </StateMessage>
    </main>
  </NuxtLayout>
</template>
