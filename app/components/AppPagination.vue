<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  page: number
  total: number
  /** Builds the link for a page number. */
  to: (page: number) => RouteLocationRaw
}>()

const { t } = useI18n()
const { number } = useFormat()

const items = computed(() => getVisiblePages(props.page, props.total))
const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= props.total)

const controls = computed(() => ({
  first: { label: t('pagination.first'), page: 1, disabled: isFirst.value },
  prev: { label: t('pagination.prev'), page: props.page - 1, disabled: isFirst.value },
  next: { label: t('pagination.next'), page: props.page + 1, disabled: isLast.value },
  last: { label: t('pagination.last'), page: props.total, disabled: isLast.value },
}))

// Links use `custom` rendering: vue-router ignores the query when matching the
// active route, so it would mark every page link as aria-current="page".
const itemClass =
  'grid size-6 place-items-center rounded-full text-base leading-none font-medium text-muted transition-colors'
const linkClass = `${itemClass} hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none`
</script>

<template>
  <nav v-if="total > 1" :aria-label="$t('pagination.label')" class="pt-4">
    <ul class="flex items-center justify-center gap-2">
      <li v-for="key in ['first', 'prev'] as const" :key="key">
        <span
          v-if="controls[key].disabled"
          role="link"
          aria-disabled="true"
          :aria-label="controls[key].label"
          :class="[itemClass, 'opacity-40']"
        >
          <IconChevron :double="key === 'first'" class="size-4 rtl:rotate-180" />
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(controls[key].page)" custom>
          <a
            :href="href ?? undefined"
            :aria-label="controls[key].label"
            :class="linkClass"
            @click="navigate"
          >
            <IconChevron :double="key === 'first'" class="size-4 rtl:rotate-180" />
          </a>
        </NuxtLink>
      </li>

      <li v-for="item in items" :key="item">
        <span v-if="typeof item !== 'number'" :class="itemClass" aria-hidden="true">…</span>
        <span
          v-else-if="item === page"
          :class="[itemClass, 'bg-accent text-base-dark']"
          aria-current="page"
        >
          <span class="sr-only">{{ `${$t('pagination.page')} ` }}</span>{{ number(item) }}
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(item)" custom>
          <a :href="href ?? undefined" :class="linkClass" @click="navigate">
            <span class="sr-only">{{ `${$t('pagination.page')} ` }}</span>{{ number(item) }}
          </a>
        </NuxtLink>
      </li>

      <li v-for="key in ['next', 'last'] as const" :key="key">
        <span
          v-if="controls[key].disabled"
          role="link"
          aria-disabled="true"
          :aria-label="controls[key].label"
          :class="[itemClass, 'opacity-40']"
        >
          <IconChevron :double="key === 'last'" class="size-4 rotate-180 rtl:rotate-0" />
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(controls[key].page)" custom>
          <a
            :href="href ?? undefined"
            :aria-label="controls[key].label"
            :class="linkClass"
            @click="navigate"
          >
            <IconChevron :double="key === 'last'" class="size-4 rotate-180 rtl:rotate-0" />
          </a>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
