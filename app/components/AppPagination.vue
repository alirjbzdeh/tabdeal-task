<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  page: number
  total: number
  to: (page: number) => RouteLocationRaw
}>()

const { t } = useI18n()
const { number } = useFormat()

type Item =
  | { kind: 'control'; key: string; label: string; page: number; disabled: boolean; icon: string }
  | { kind: 'page'; key: string; page: number; current: boolean }
  | { kind: 'gap'; key: string }

const items = computed<Item[]>(() => {
  const { page, total } = props
  const atStart = page <= 1
  const atEnd = page >= total
  const control = (key: 'first' | 'prev' | 'next' | 'last', target: number, disabled: boolean) => ({
    kind: 'control' as const,
    key,
    label: t(`pagination.${key}`),
    page: target,
    disabled,
    icon: key === 'first' || key === 'prev' ? 'rtl:rotate-180' : 'rotate-180 rtl:rotate-0',
  })

  return [
    control('first', 1, atStart),
    control('prev', page - 1, atStart),
    ...getVisiblePages(page, total).map((item) =>
      typeof item === 'number'
        ? { kind: 'page' as const, key: `page-${item}`, page: item, current: item === page }
        : { kind: 'gap' as const, key: item },
    ),
    control('next', page + 1, atEnd),
    control('last', total, atEnd),
  ]
})

const pageLabel = computed(() => `${t('pagination.page')} `)

const itemClass =
  'grid size-6 place-items-center rounded-full text-base leading-none font-medium transition-colors'
const mutedClass = `${itemClass} text-muted`
const linkClass = `${mutedClass} hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none`
</script>

<template>
  <nav v-if="total > 1" :aria-label="$t('pagination.label')" class="pt-4">
    <ul class="flex items-center justify-center gap-2">
      <li v-for="item in items" :key="item.key">
        <span v-if="item.kind === 'gap'" :class="mutedClass" aria-hidden="true">…</span>
        <span
          v-else-if="item.kind === 'page' && item.current"
          :class="[itemClass, 'bg-accent text-base-dark']"
          aria-current="page"
        >
          <span class="sr-only">{{ pageLabel }}</span>{{ number(item.page) }}
        </span>
        <span
          v-else-if="item.kind === 'control' && item.disabled"
          role="link"
          aria-disabled="true"
          :aria-label="item.label"
          :class="[mutedClass, 'opacity-40']"
        >
          <IconChevron
            :double="item.key === 'first' || item.key === 'last'"
            :class="['size-4', item.icon]"
          />
        </span>
        <NuxtLink v-else v-slot="{ href, navigate }" :to="to(item.page)" custom>
          <a
            :href="href ?? undefined"
            :aria-label="item.kind === 'control' ? item.label : undefined"
            :class="linkClass"
            @click="navigate"
          >
            <IconChevron
              v-if="item.kind === 'control'"
              :double="item.key === 'first' || item.key === 'last'"
              :class="['size-4', item.icon]"
            />
            <template v-else>
              <span class="sr-only">{{ pageLabel }}</span>{{ number(item.page) }}
            </template>
          </a>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
