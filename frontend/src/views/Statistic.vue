<script setup>
import { ref, onMounted, shallowRef, computed } from 'vue'
import { getStatisticsSummary, getStatisticsTimeline, getStatisticsErrors } from '../services/api'
import KPICard from '../components/KPICard.vue'
import StatisticHistoryTable from '../components/StatisticHistoryTable.vue'
import { Chart, registerables } from 'chart.js'
import { useI18n } from 'vue-i18n'

Chart.register(...registerables)

const { t } = useI18n()
const summary = ref(null)
const range = ref('7d')
const timelineCanvas = ref(null)
const errorCanvas = ref(null)
const timelineChart = shallowRef(null)
const errorChart = shallowRef(null)
const historyRefresh = ref(0)
const loading = ref(true)

const summaryStats = computed(() => {
  if (!summary.value) return null
  return {
    total: summary.value.total_validations || 0,
    successRate: summary.value.valid_percentage || 0,
    errors: summary.value.error_count || 0,
    warnings: summary.value.warning_count || 0
  }
})

async function fetchSummary() {
  try {
    summary.value = await getStatisticsSummary()
  } catch (e) {
    console.error('Failed to fetch summary:', e)
  } finally {
    loading.value = false
  }
}

async function renderTimeline() {
  const data = await getStatisticsTimeline(range.value)
  
  if (!timelineCanvas.value) return
  
  if (timelineChart.value) {
    timelineChart.value.destroy()
  }

  const ctx = timelineCanvas.value.getContext('2d')
  if (!ctx) return
  
  const gradientValid = ctx.createLinearGradient(0, 0, 0, 300)
  gradientValid.addColorStop(0, 'rgba(0, 217, 126, 0.25)')
  gradientValid.addColorStop(1, 'rgba(0, 217, 126, 0)')

  const gradientInvalid = ctx.createLinearGradient(0, 0, 0, 300)
  gradientInvalid.addColorStop(0, 'rgba(230, 55, 87, 0.25)')
  gradientInvalid.addColorStop(1, 'rgba(230, 55, 87, 0)')
  
  timelineChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Validi',
          data: data.map(d => d.valid),
          borderColor: '#00d97e',
          backgroundColor: gradientValid,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00d97e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Non Validi',
          data: data.map(d => d.invalid),
          borderColor: '#e63757',
          backgroundColor: gradientInvalid,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#e63757',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { 
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { size: 12, weight: '500' }
          }
        },
        tooltip: { 
          mode: 'index', 
          intersect: false,
          backgroundColor: 'rgba(18, 38, 63, 0.95)',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw} validazioni`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: { 
          beginAtZero: true, 
          ticks: { stepSize: 1 },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  })
}

async function renderErrorDistribution() {
  const data = await getStatisticsErrors()
  
  if (!errorCanvas.value) return
  
  if (errorChart.value) {
    errorChart.value.destroy()
  }

  const ctx = errorCanvas.value.getContext('2d')
  if (!ctx) return

  const colors = [
    '#e63757', '#f6c23e', '#2C7BE5', '#00d97e', 
    '#6f42c1', '#e83e8c', '#20c997', '#6c757d'
  ]

  errorChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.error_type),
      datasets: [{
        label: 'Occorrenze',
        data: data.map(d => d.count),
        backgroundColor: colors.slice(0, data.length),
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(18, 38, 63, 0.95)',
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return ` ${context.raw} occorrenze`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11, weight: '500' } }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  })
}

function handleRangeChange() {
  renderTimeline()
}

onMounted(() => {
  fetchSummary()
  renderTimeline()
  renderErrorDistribution()
})
</script><template>
  <div class="statistics-view">
    <!-- Header Section -->
    <div class="page-header mb-5">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title font-weight-bold mb-1">
            <i class="fe fe-bar-chart-2 mr-2"></i>Analytics Dashboard
          </h1>
          <p class="page-subtitle text-muted mb-0">Insights on validation performance and recurring errors.</p>
        </div>
        <div class="col-auto">
          <div class="date-range-selector">
            <select class="form-select form-select-solid" v-model="range" @change="handleRangeChange">
              <option value="7d">{{ t('statistics.range.7d') || 'Last 7 Days' }}</option>
              <option value="30d">{{ t('statistics.range.30d') || 'Last 30 Days' }}</option>
              <option value="90d">{{ t('statistics.range.90d') || 'Last 90 Days' }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-skeleton">
      <div class="row row-sm mb-5">
        <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0" v-for="i in 4" :key="i">
          <div class="skeleton-card skeleton"></div>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-12 col-lg-8 mb-5">
          <div class="skeleton-chart skeleton"></div>
        </div>
        <div class="col-12 col-lg-4 mb-5">
          <div class="skeleton-chart skeleton"></div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-else class="row row-sm mb-5" v-if="summary">
      <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
        <KPICard 
          :title="t('statistics.kpi.total') || 'Total Validations'" 
          :value="summaryStats.total" 
          icon="file-text" 
          variant="primary"
          :trend="{ value: 12, positive: true }"
        />
      </div>
      <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
        <KPICard 
          :title="t('statistics.kpi.success_rate') || 'Success Rate'" 
          :value="`${summaryStats.successRate}%`" 
          icon="check-circle" 
          variant="success"
          :trend="{ value: 5, positive: true }"
        />
      </div>
      <div class="col-12 col-md-6 col-lg-3 mb-4 mb-md-0">
        <KPICard 
          :title="t('statistics.kpi.failed') || 'Failed Invoices'" 
          :value="summaryStats.errors" 
          icon="x-circle" 
          variant="danger"
          :trend="{ value: 8, positive: false }"
        />
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <KPICard 
          :title="t('statistics.kpi.warnings') || 'Warnings'" 
          :value="summaryStats.warnings" 
          icon="alert-triangle" 
          variant="warning"
        />
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row" v-if="!loading">
      <div class="col-12 col-lg-8 mb-5">
        <div class="card border-0 shadow-sm h-100 chart-card">
          <div class="card-header bg-white py-4">
            <h5 class="mb-0 font-weight-bold chart-title">
              <i class="fe fe-trending-up chart-icon mr-2"></i>Validation Timeline
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="chart-container">
              <canvas ref="timelineCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 mb-5">
        <div class="card border-0 shadow-sm h-100 chart-card">
          <div class="card-header bg-white py-4">
            <h5 class="mb-0 font-weight-bold chart-title">
              <i class="fe fe-alert-circle chart-icon mr-2"></i>Top Error Types
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="chart-container">
              <canvas ref="errorCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- History Table -->
    <StatisticHistoryTable v-if="!loading" :refreshTrigger="historyRefresh" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 320px;
  width: 100%;
}

.row-sm { margin-right: -10px; margin-left: -10px; }
.row-sm > [class*="col-"] { padding-right: 10px; padding-left: 10px; }

/* Page Header Styles */
.page-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 1.75rem;
  color: #12263f;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #2C7BE5;
}

.page-subtitle {
  font-size: 0.95rem;
}

/* Date Range Selector */
.date-range-selector .form-select {
  min-width: 160px;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e3ebf6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-range-selector .form-select:hover {
  border-color: #2C7BE5;
}

.date-range-selector .form-select:focus {
  border-color: #2C7BE5;
  box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.15);
}

/* Chart Card Styles */
.chart-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
}

.chart-title {
  font-size: 1rem;
  display: flex;
  align-items: center;
  color: #12263f;
}

.chart-icon {
  color: #2C7BE5;
  font-size: 1.1rem;
}

/* Loading Skeleton */
.loading-skeleton .skeleton-card {
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.loading-skeleton .skeleton-chart {
  height: 380px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
