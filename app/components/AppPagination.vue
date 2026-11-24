<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  page: number
  total: number
  /** Builds the link for a page number. */
  to: (page: number) => RouteLocationRaw
}>()

const items = computed(() => getVisiblePages(props.page, props.total))
const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= props.total)

const controls = computed(() => ({
  first: { label: 'First page', page: 1, disabled: isFirst.value },
  prev: { label: 'Previous page', page: props.page - 1, disabled: isFirst.value },
  next: { label: 'Next page', page: props.page + 1, disabled: isLast.value },
  last: { label: 'Last page', page: props.total, disabled: isLast.value },
}))

// Links use `custom` rendering: vue-router ignores the query when matching the
// active route, so it would mark every page link as aria-current="page".
const itemClass =
  'grid size-6 place-items-center rounded-full text-base leading-none font-medium text-muted transition-colors'
const linkClass = `${itemClass} hover:text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none`
</script>

<template>
  <nav v-if="total > 1" aria-label="Pagination" class="pt-4">
    <ul class="flex items-center justify-center gap-2">
      <li v-for="key in ['first', 'prev'] as const" :key="key">
        <span v-if="controls[key].disabled" :class="[itemClass, 'opacity-40']" aria-hidden="true">
          <IconChevron :double="key === 'first'" class="size-4" />
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(controls[key].page)" custom>
          <a
            :href="href ?? undefined"
            :aria-label="controls[key].label"
            :class="linkClass"
            @click="navigate"
          >
            <IconChevron :double="key === 'first'" class="size-4" />
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
          <span class="sr-only">Page</span>{{ item }}
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(item)" custom>
          <a :href="href ?? undefined" :class="linkClass" @click="navigate">
            <span class="sr-only">Page</span>{{ item }}
          </a>
        </NuxtLink>
      </li>

      <li v-for="key in ['next', 'last'] as const" :key="key">
        <span v-if="controls[key].disabled" :class="[itemClass, 'opacity-40']" aria-hidden="true">
          <IconChevron :double="key === 'last'" class="size-4 rotate-180" />
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(controls[key].page)" custom>
          <a
            :href="href ?? undefined"
            :aria-label="controls[key].label"
            :class="linkClass"
            @click="navigate"
          >
            <IconChevron :double="key === 'last'" class="size-4 rotate-180" />
          </a>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
