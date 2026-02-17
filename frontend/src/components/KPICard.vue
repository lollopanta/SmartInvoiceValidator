<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
  variant: {
    type: String,
    default: 'primary'
  },
  trend: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div class="kpi-card card h-100 border-0 shadow-sm card-animate">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col">
          <h6 class="text-uppercase text-muted mb-2 font-size-xs font-weight-bold">
            {{ title }}
          </h6>
          <div class="d-flex align-items-baseline">
            <span class="h2 font-weight-bold mb-0 kpi-value">
              {{ value }}
            </span>
            <span v-if="trend" :class="['trend-badge ml-2', trend.positive ? 'trend-up' : 'trend-down']">
              <i :class="trend.positive ? 'fe fe-trending-up' : 'fe fe-trending-down'"></i>
              {{ trend.value }}%
            </span>
          </div>
          <div v-if="subtitle" class="mt-2 text-muted font-size-xs">
            {{ subtitle }}
          </div>
        </div>
        <div class="col-auto">
          <div :class="`icon-shape bg-${variant}-soft text-${variant} rounded-3 shadow-none`">
            <i :class="`fe fe-${icon}`"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  border-radius: 12px;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color, #2C7BE5), transparent);
}

.card-animate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.card-animate:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.icon-shape {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}

.bg-primary-soft { background-color: rgba(44, 123, 229, 0.12); --accent-color: #2C7BE5; }
.text-primary { color: #2C7BE5; }
.bg-success-soft { background-color: rgba(0, 217, 126, 0.12); --accent-color: #00d97e; }
.text-success { color: #00d97e; }
.bg-danger-soft { background-color: rgba(230, 55, 87, 0.12); --accent-color: #e63757; }
.text-danger { color: #e63757; }
.bg-warning-soft { background-color: rgba(246, 194, 62, 0.12); --accent-color: #f6c23e; }
.text-warning { color: #f6c23e; }

.font-size-xs { font-size: 0.75rem; }

.kpi-value {
  font-size: 2rem;
  line-height: 1;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.trend-badge i {
  font-size: 0.7rem;
  margin-right: 2px;
}

.trend-up {
  background-color: rgba(0, 217, 126, 0.15);
  color: #00a869;
}

.trend-down {
  background-color: rgba(230, 55, 87, 0.15);
  color: #c82333;
}

.rounded-3 {
  border-radius: 12px !important;
}
</style>
