<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  history: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString(locale.value === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat(locale.value === 'it' ? 'it-IT' : 'en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}
</script>

<template>
  <div class="history-card mt-5">
    <div class="card-header-custom d-flex align-items-center justify-content-between mb-4">
      <h3 class="h5 mb-0 font-weight-bold">
        <i class="fe fe-clock text-primary mr-2"></i> {{ t('history.title') }}
      </h3>
      <span v-if="loading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
    </div>

    <div v-if="history.length === 0 && !loading" class="text-center py-5">
      <p class="text-muted mb-0 font-size-sm">{{ t('history.empty') }}</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-sm table-nowrap card-table">
        <thead>
          <tr>
            <th>{{ t('history.date') }}</th>
            <th>{{ t('history.partita_iva') }}</th>
            <th>{{ t('history.imponibile') }}</th>
            <th>{{ t('history.status') }}</th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="item in history" :key="item.id" class="history-row">
            <td class="font-size-sm text-muted">{{ formatDate(item.created) }}</td>
            <td class="font-weight-medium">{{ item.partita_iva }}</td>
            <td class="font-size-sm">{{ formatCurrency(item.imponibile) }}</td>
            <td>
              <span 
                class="badge badge-soft-success" 
                :class="item.valid ? 'badge-soft-success' : 'badge-soft-danger'"
              >
                {{ item.valid ? t('history.valid') : t('history.invalid') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.history-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.card-header-custom h3 {
  letter-spacing: -0.01em;
  color: #12263F;
}

.table th {
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #95AAC9;
  border-top: none;
  padding: 0.75rem 0.5rem;
}

.history-row {
  transition: background-color 0.2s ease;
}

.history-row:hover {
  background-color: rgba(44, 123, 229, 0.03);
}

.history-row td {
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.badge-soft-success {
  background-color: #e1fcef;
  color: #00d97e;
}

.badge-soft-danger {
  background-color: #fee7e9;
  color: #e63757;
}

.font-weight-medium {
  font-weight: 500;
  color: #12263F;
}
</style>
