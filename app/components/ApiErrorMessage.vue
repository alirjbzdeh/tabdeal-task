<script setup lang="ts">
import type { ApiErrorView } from '~/composables/useApiError'

defineProps<{ error: ApiErrorView }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <StateMessage :title="error.title" :text="error.message">
    <button v-if="error.canRetry" type="button" class="btn-primary mt-2" @click="$emit('retry')">
      {{ $t('errors.retry') }}
    </button>
  </StateMessage>
</template>
