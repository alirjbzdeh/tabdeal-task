<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string; debounce?: number }>(), {
  modelValue: '',
  debounce: SEARCH_DEBOUNCE,
})
const emit = defineEmits<{ search: [value: string] }>()

const localePath = useLocalePath()
const inputId = useId()

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

function onInput() {
  cancel()
  timer = setTimeout(emitSearch, props.debounce)
}

watch(
  () => props.modelValue,
  (value) => {
    if (value !== text.value.trim()) {
      cancel()
      text.value = value
    }
  },
)

let typedBeforeHydration = ''
onBeforeMount(() => {
  const el = document.getElementById(inputId) as HTMLInputElement | null
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
  <form
    role="search"
    :action="localePath('/')"
    method="get"
    class="flex h-20 items-center gap-4 rounded-lg bg-base p-4"
    @submit.prevent="emitSearch"
  >
    <label :for="inputId" class="sr-only">{{ $t('search.label') }}</label>
    <input
      :id="inputId"
      v-model="text"
      name="name"
      type="search"
      :placeholder="$t('search.placeholder')"
      autocomplete="off"
      enterkeyhint="search"
      class="h-12 min-w-0 flex-1 rounded bg-input py-3 ps-4 pe-2 text-sm leading-normal text-foreground placeholder:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
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
