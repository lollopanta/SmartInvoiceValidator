<script setup>
import { ref, onMounted, nextTick } from 'vue'
import InvoiceForm from '../components/InvoiceForm.vue'
import ValidationResult from '../components/ValidationResult.vue'
import HistorySection from '../components/HistorySection.vue'
import { validateInvoice, getValidationHistory } from '../services/api'
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
</script><template><div class="home-view">
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
        
        <div class="text-center mt-4">
          <router-link to="/statistic" class="btn btn-outline-primary shadow-sm">
            <i class="fe fe-bar-chart-2 mr-2"></i>
            {{ t('app.view_statistics') || 'Visualizza Statistiche' }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
