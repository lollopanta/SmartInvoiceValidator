<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 'valid' | 'invalid' | 'warning' */
  status: { type: String, required: true },
  label: { type: String, default: '' },
})

const displayLabel = computed(() => {
  if (props.label) return props.label
  switch (props.status) {
    case 'valid': return 'Valido'
    case 'invalid': return 'Errori'
    case 'warning': return 'Valido con avvisi'
    default: return props.status
  }
})

const badgeClass = computed(() => {
  switch (props.status) {
    case 'valid': return 'badge-primary-soft'
    case 'invalid': return 'badge-invalid-custom'
    case 'warning': return 'badge-warning-custom'
    default: return 'badge-secondary'
  }
})
</script>

<template>
  <span :class="['badge', 'status-pill', badgeClass]">{{ displayLabel }}</span>
</template>

<style scoped>
.status-pill {
  border-radius: 50px;
  padding: 0.35rem 0.85rem;
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
