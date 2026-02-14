<template>
  <div v-if="hasResult" class="result-card card border-0 shadow-sm" :class="statusClass">
    <div class="card-body p-4">
      <div class="result-header mb-3">
        <StatusBadge v-if="status" :status="status" />
        <h5 v-if="status" class="mb-0 ml-2" :class="textClass">{{ title }}</h5>
      </div>
      
      <div v-if="networkError" class="alert alert-danger py-2 px-3 mb-0">
        <i class="fas fa-exclamation-triangle mr-2"></i> {{ networkError }}
      </div>

      <template v-if="data">
        <!-- Error Container -->
        <div v-if="errors.length" class="error-container mb-3">
          <ul class="result-list result-list--errors pl-0 mb-0">
            <li v-for="(msg, i) in errors" :key="'e-' + i" class="d-flex align-items-start mb-3">
              <div class="error-icon-wrapper mr-3">
                <i :class="getErrorIcon(msg)"></i>
              </div>
              <div class="error-text">
                {{ msg }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Warning Container -->
        <div v-if="warnings.length" class="warning-container mb-3">
          <ul class="result-list result-list--warnings pl-0 mb-0">
            <li v-for="(msg, i) in warnings" :key="'w-' + i" class="d-flex align-items-start">
              <div class="warning-icon-wrapper mr-2">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div class="warning-text">
                {{ msg }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Success Message -->
        <div v-if="status === 'valid'" class="success-message">
          <i class="fas fa-check-circle mr-2"></i> {{ t('result.success_msg') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatusBadge from './StatusBadge.vue'

const { t } = useI18n()
const props = defineProps({
  /** { ok, status, data?, error? } from api */
  result: { type: Object, default: null },
})

const hasResult = computed(() => props.result != null)

const status = computed(() => {
  if (!props.result) return null
  if (!props.result.ok) return 'invalid'
  const d = props.result.data
  if (!d) return 'invalid'
  if (d.errors && d.errors.length > 0) return 'invalid'
  if (d.warnings && d.warnings.length > 0) return 'warning'
  return 'valid'
})

const title = computed(() => {
  if (status.value === 'valid') return t('result.valid')
  if (status.value === 'warning') return t('result.warnings')
  return t('result.invalid')
})

const statusClass = computed(() => {
  if (status.value === 'valid') return 'border-success-soft bg-success-light'
  if (status.value === 'warning') return 'border-warning-soft bg-warning-light'
  return 'border-danger-soft bg-danger-light'
})

const textClass = computed(() => {
  if (status.value === 'valid') return 'text-success'
  if (status.value === 'warning') return 'text-warning'
  return 'text-danger'
})

const data = computed(() => props.result?.data ?? null)
const networkError = computed(() => {
  if (props.result && !props.result.ok) {
     if (props.result.status === 422) return t('errors.invalid_data')
     return t('errors.server_error', { status: props.result.status })
  }
  return null
})
const errors = computed(() => data.value?.errors ?? [])
const warnings = computed(() => data.value?.warnings ?? [])
const totalCalculated = computed(() => data.value?.total_calculated ?? null)

function getErrorIcon(msg) {
  const m = msg.toLowerCase()
  if (m.includes('cifre') || m.includes('digits') || m.includes('obbligatorio') || m.includes('required')) {
    return 'fas fa-pen-nib'
  }
  if (m.includes('controllo') || m.includes('checksum')) {
    return 'fas fa-fingerprint'
  }
  if (m.includes('corrisponde') || m.includes('match')) {
    return 'fas fa-calculator'
  }
  return 'fas fa-exclamation-circle'
}
</script>

<style scoped>
.result-card {
  margin-top: 1rem;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: opacity 0.2s ease;
}

/* Status Variations */
.border-danger-soft {
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444 !important;
}
.bg-danger-light { background-color: #fef2f2; }

.border-warning-soft {
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b !important;
}
.bg-warning-light { background-color: #fffbeb; }

.border-success-soft {
  border: 1px solid #d1fae5;
  border-left: 4px solid #10b981 !important;
}
.bg-success-light { background-color: #f0fdf4; }

.result-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-list {
  list-style-type: none;
  padding-left: 0;
  font-size: 0.95rem;
}

/* Error Styles */
.result-list--errors { color: #991b1b; }
.error-container {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
}
.error-icon-wrapper {
  color: #ef4444;
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.error-text {
  line-height: 1.4;
  font-weight: 500;
}

/* Warning Styles */
.result-list--warnings { color: #92400e; }
.warning-container {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fde68a;
}
.warning-icon-wrapper { color: #f59e0b; }
.warning-text { font-size: 0.9rem; }

/* Success Styles */
.success-message {
  color: #065f46;
  font-weight: 600;
  font-size: 1rem;
}
</style>
