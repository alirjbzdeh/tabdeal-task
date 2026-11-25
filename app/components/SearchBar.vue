<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string; debounce?: number }>(), {
  modelValue: '',
  debounce: 400,
})
const emit = defineEmits<{ search: [value: string] }>()

const localePath = useLocalePath()

const text = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | undefined

function cancel() {
  clearTimeout(timer)
  timer = undefined
}

function emitSearch() {
  cancel()
  const value = text.value.trim()
  if (value !== props.modelValue) emit('search', value)
}

// Search while typing, after a short pause.
function onInput() {
  cancel()
  timer = setTimeout(emitSearch, props.debounce)
}

// Keep the field in sync when the URL changes (back/forward, "clear search" link).
watch(
  () => props.modelValue,
  (value) => {
    if (value !== text.value.trim()) {
      cancel()
      text.value = value
    }
  },
)

// Text typed before hydration would be wiped when v-model takes over the input.
// Grab it first, then search for it once the component is live.
let typedBeforeHydration = ''
onBeforeMount(() => {
  const el = document.getElementById('character-search') as HTMLInputElement | null
  typedBeforeHydration = el?.value ?? ''
})
onMounted(() => {
  if (typedBeforeHydration && typedBeforeHydration !== text.value) {
    text.value = typedBeforeHydration
    onInput()
  }
})

onBeforeUnmount(cancel)
</script>

<template>
  <!-- A real GET form: search works even before JS loads. -->
  <form
    role="search"
    :action="localePath('/')"
    method="get"
    class="flex h-20 items-center gap-4 rounded-lg bg-base p-4"
    @submit.prevent="emitSearch"
  >
    <label for="character-search" class="sr-only">{{ $t('search.label') }}</label>
    <input
      id="character-search"
      v-model="text"
      name="name"
      type="search"
      :placeholder="$t('search.placeholder')"
      autocomplete="off"
      enterkeyhint="search"
      class="h-12 min-w-0 flex-1 rounded bg-input ps-4 pe-2 text-sm text-foreground placeholder:text-foreground-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      @input="onInput"
    />
    <button
      type="submit"
      class="inline-flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded bg-accent text-sm leading-none font-medium text-on-accent transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none md:w-auto md:px-4"
    >
      <IconSearch class="size-3.5" />
      <span class="sr-only md:not-sr-only">{{ $t('search.button') }}</span>
    </button>
  </form>
</template>
