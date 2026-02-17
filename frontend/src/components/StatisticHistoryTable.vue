<script setup>
import { ref, watch, computed } from 'vue'
import { getPaginatedValidations } from '../services/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps(['refreshTrigger'])

const data = ref([])
const pagination = ref({ pages: 1, current: 1 })
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')

// Computed for safe access
const safeData = computed(() => data.value || [])
const safePagination = computed(() => pagination.value || { pages: 1, current: 1 })

const params = ref({
  page: 1,
  limit: 10,
  sort: 'created',
  direction: 'DESC'
})

async function fetchData() {
  loading.value = true
  const queryParams = {
    ...params.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined
  }
  
  try {
    const res = await getPaginatedValidations(queryParams)
    data.value = res?.data || []
    pagination.value = res?.pagination || { pages: 1, current: 1 }
  } catch (e) {
    console.error('Failed to fetch history:', e)
    data.value = []
    pagination.value = { pages: 1, current: 1 }
  } finally {
    loading.value = false
  }
}

function handleSort(col) {
  if (params.value.sort === col) {
    params.value.direction = params.value.direction === 'ASC' ? 'DESC' : 'ASC'
  } else {
    params.value.sort = col
    params.value.direction = 'DESC'
  }
  params.value.page = 1
  fetchData()
}

function changePage(page) {
  if (page < 1 || page > safePagination.value.pages) return
  params.value.page = page
  fetchData()
}

function handleSearch() {
  params.value.page = 1
  fetchData()
}

function handleFilterChange() {
  params.value.page = 1
  fetchData()
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  params.value.page = 1
  fetchData()
}

watch(() => props.refreshTrigger, () => {
  loading.value = true
  fetchData()
}, { immediate: true })

// Debounced search
let searchTimeout = null
watch([searchQuery, statusFilter], () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 400)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const visiblePages = computed(() => {
  const pages = []
  const total = safePagination.value.pages || 1
  const current = params.value.page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, 5)
    } else {
      start = Math.max(1, total - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<template>
  <div class="history-card card border-0 shadow-sm mt-5">
    <div class="card-header bg-white py-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h5 class="mb-0 font-weight-bold">
            <i class="fe fe-clock mr-2 text-muted"></i>{{ t('statistics.history_title') || 'Cronologia Validazioni' }}
          </h5>
        </div>
        <div class="col-md-6">
          <div class="row g-2">
            <div class="col-12 col-sm-8">
              <div class="search-box">
                <i class="fe fe-search search-icon"></i>
                <input 
                  type="text" 
                  class="form-control form-control-sm search-input" 
                  :placeholder="t('statistics.search_placeholder') || 'Search by VAT number...'"
                  v-model="searchQuery"
                >
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <select class="form-select form-select-sm status-select" v-model="statusFilter" @change="handleFilterChange">
                <option value="">{{ t('statistics.filter_all') || 'All Status' }}</option>
                <option value="valid">{{ t('statistics.filter_valid') || 'Valid' }}</option>
                <option value="invalid">{{ t('statistics.filter_invalid') || 'Invalid' }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="table table-hover table-nowrap card-table mb-0">
        <thead>
          <tr>
            <th class="cursor-pointer th-sortable" @click="handleSort('created')">
              {{ t('statistics.columns.date') || 'Data' }}
              <span class="sort-icon" v-if="params.sort === 'created'">
                <i :class="`fe fe-chevron-${params.direction === 'ASC' ? 'up' : 'down'}`"></i>
              </span>
            </th>
            <th>Partita IVA</th>
            <th class="cursor-pointer th-sortable text-right" @click="handleSort('imponibile')">
              {{ t('statistics.columns.amount') || 'Imponibile' }}
              <span class="sort-icon" v-if="params.sort === 'imponibile'">
                <i :class="`fe fe-chevron-${params.direction === 'ASC' ? 'up' : 'down'}`"></i>
              </span>
            </th>
            <th class="cursor-pointer th-sortable text-center" @click="handleSort('valid')">
              Stato
              <span class="sort-icon" v-if="params.sort === 'valid'">
                <i :class="`fe fe-chevron-${params.direction === 'ASC' ? 'up' : 'down'}`"></i>
              </span>
            </th>
            <th class="text-center">Errori</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center py-5">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="safeData.length === 0">
            <td colspan="5" class="text-center py-5">
              <div class="empty-state">
                <i class="fe fe-inbox empty-icon"></i>
                <p class="text-muted mb-0">{{ t('app.no_history') || 'No validation history found' }}</p>
              </div>
            </td>
          </tr>
          <tr v-for="item in safeData" :key="item.id" class="table-row">
            <td class="text-muted">{{ formatDate(item.created) }}</td>
            <td class="font-weight-bold text-primary">{{ item.partita_iva }}</td>
            <td class="text-right font-weight-medium">€ {{ item.imponibile?.toLocaleString('it-IT', { minimumFractionDigits: 2 }) || '0,00' }}</td>
            <td class="text-center">
              <span :class="`status-badge badge badge-pill badge-${item.valid ? 'success' : 'danger'}-soft`">
                <i :class="item.valid ? 'fe fe-check-circle mr-1' : 'fe fe-x-circle mr-1'"></i>
                {{ item.valid ? 'Valido' : 'Non Valido' }}
              </span>
            </td>
            <td class="text-center">
              <span v-if="item.valid" class="text-muted">-</span>
              <span v-else class="error-count">{{ item.error_count || 1 }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="card-footer bg-white border-top-0 py-3" v-if="safePagination.pages > 1">
      <nav class="d-flex justify-content-between align-items-center">
        <span class="text-muted font-size-sm">
          <span class="page-info">
            Pagina <strong>{{ safePagination.current }}</strong> di <strong>{{ safePagination.pages }}</strong>
          </span>
        </span>
        <ul class="pagination pagination-sm mb-0">
          <li :class="['page-item', { disabled: params.page === 1 }]">
            <a class="page-link" href="#" @click.prevent="changePage(params.page - 1)">
              <i class="fe fe-chevron-left"></i>
            </a>
          </li>
          <li v-for="page in visiblePages" :key="page" :class="['page-item', { active: params.page === page }]">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li :class="['page-item', { disabled: params.page === safePagination.pages }]">
            <a class="page-link" href="#" @click.prevent="changePage(params.page + 1)">
              <i class="fe fe-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.history-card {
  border-radius: 12px;
  overflow: hidden;
}

.cursor-pointer { cursor: pointer; }

/* Header Styles */
.card-header h5 {
  font-size: 1.1rem;
  color: #12263f;
}

/* Search Box */
.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #95aac9;
  font-size: 0.875rem;
}

.search-input {
  padding-left: 36px;
  border-radius: 8px;
  border: 1px solid #e3ebf6;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #2C7BE5;
  box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.1);
}

.status-select {
  border-radius: 8px;
  border: 1px solid #e3ebf6;
  font-size: 0.875rem;
  cursor: pointer;
}

.status-select:focus {
  border-color: #2C7BE5;
  box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.1);
}

/* Table Styles */
.table th {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #95aac9;
  border-top: 0;
  background-color: #f8f9fa;
  padding: 14px 16px;
}

.table th.th-sortable {
  white-space: nowrap;
}

.th-sortable:hover {
  color: #2C7BE5;
}

.sort-icon {
  margin-left: 4px;
  font-size: 0.65rem;
}

.table td {
  vertical-align: middle;
  font-size: 0.9rem;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(44, 123, 229, 0.03);
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success-soft {
  background-color: rgba(0, 217, 126, 0.12);
  color: #00a869;
}

.badge-danger-soft {
  background-color: rgba(230, 55, 87, 0.12);
  color: #c82333;
}

.error-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background-color: rgba(230, 55, 87, 0.15);
  color: #c82333;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  padding: 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: #cbd5e0;
  margin-bottom: 0.5rem;
}

/* Pagination */
.pagination {
  gap: 4px;
}

.page-item .page-link {
  border: none;
  border-radius: 6px;
  color: #6c757d;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.page-item .page-link:hover {
  background-color: #f0f4f8;
  color: #2C7BE5;
}

.page-item.active .page-link {
  background-color: #2C7BE5;
  color: white;
}

.page-item.disabled .page-link {
  background-color: transparent;
  color: #cbd5e0;
}

.font-size-sm { font-size: 0.85rem; }

.text-primary {
  color: #2C7BE5 !important;
}
</style>
