<script setup>
import { ref, onMounted, nextTick } from 'vue'
import InvoiceForm from './components/InvoiceForm.vue'
import ValidationResult from './components/ValidationResult.vue'
import HistorySection from './components/HistorySection.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { validateInvoice, getValidationHistory } from './services/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const result = ref(null)
const loading = ref(false)
const historyLoading = ref(false)
const history = ref([])
const resultRef = ref(null)

async function fetchHistory() {
  historyLoading.value = true
  history.value = await getValidationHistory()
  historyLoading.value = false
}

async function handleValidate(payload) {
  loading.value = true
  result.value = null
  const response = await validateInvoice(payload)
  loading.value = false
  result.value = response
  
  if (response.ok) {
    // Refresh history after validation
    fetchHistory()
  }

  await nextTick()
  scrollToResult()
}

function scrollToResult() {
  if (typeof window !== 'undefined' && window.$ && resultRef.value?.$el) {
    const $el = window.$(resultRef.value.$el)
    $el.hide().slideDown(280)
    window.$('html, body').animate(
      { scrollTop: $el.offset().top - 24 },
      400
    )
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<template>
  <div class="app-wrap">
    <div class="bg-shape"></div>
    
    <section class="py-6 pb-lg-9 content-layer">
      <div class="container main-container">
        <div class="d-flex justify-content-end mb-4">
          <LanguageSwitcher />
        </div>

        <header class="text-center mb-6 header-animate">
          <div class="badge-new mb-3">{{ t('app.badges.auditing') }}</div>
          <h1 class="font-weight-bold display-4 mb-2">
            Smart <span class="text-primary-gradient">{{ t('app.invoice') }}</span> Validator
          </h1>
          <p class="font-size-lg text-main mb-0 opacity-80">
            {{ t('app.subtitle') }}
          </p>
        </header>

        <div class="row">
          <div class="col-12 col-lg-8 offset-lg-2">
            <InvoiceForm
              :loading="loading"
              @validate="handleValidate"
            />

            <ValidationResult
              ref="resultRef"
              :result="result"
            />

            <HistorySection
              :history="history"
              :loading="historyLoading"
            />
          </div>
        </div>
      </div>
    </section>

    <footer class="py-4 text-center text-muted font-size-xs opacity-50">
      &copy; 2026 SmartInvoiceValidator. Tutti i diritti riservati.
    </footer>
  </div>
</template>

<style scoped>
.app-wrap {
  position: relative;
  min-height: 100vh;
  background-color: #F9FBFD;
  overflow-x: hidden;
}

.bg-shape {
  position: absolute;
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(44, 123, 229, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
  pointer-events: none;
}

.content-layer {
  position: relative;
  z-index: 1;
}

.main-container {
  max-width: 960px;
}

.text-primary-gradient {
  background: linear-gradient(135deg, #2C7BE5 0%, #00d97e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-new {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #2C7BE5;
  background: rgba(44, 123, 229, 0.1);
  border-radius: 100px;
  letter-spacing: 0.05em;
}

.header-animate {
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.opacity-80 { opacity: 0.8; }
.opacity-50 { opacity: 0.5; }
</style>
