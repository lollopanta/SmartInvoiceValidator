<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { correctPiva } from '../services/piva'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['validate'])

const partitaIva = ref('')
const imponibile = ref('')
const aliquotaIva = ref('22')
const totaleDichiarato = ref('')

const errors = ref({})
const formRef = ref(null)

defineProps({
  loading: { type: Boolean, default: false },
})

function validateClientSide() {
  const e = {}
  if (!String(partitaIva.value || '').trim()) e.partita_iva = t('errors.invalid_data')
  else if (!/^\d{11}$/.test(String(partitaIva.value).replace(/\s/g, ''))) e.partita_iva = t('form.examples.partita_iva')
  
  const imp = Number(imponibile.value)
  if (imponibile.value === '' || imp < 0 || Number.isNaN(imp)) e.imponibile = t('errors.invalid_data')
  
  const ali = Number(aliquotaIva.value)
  if (aliquotaIva.value === '' || ali < 0 || Number.isNaN(ali)) e.aliquota_iva = t('errors.invalid_data')
  
  const tot = Number(totaleDichiarato.value)
  if (totaleDichiarato.value === '' || tot < 0 || Number.isNaN(tot)) e.totale_dichiarato = t('errors.invalid_data')
  
  errors.value = e
  return Object.keys(e).length === 0
}

function submit() {
  if (!validateClientSide()) return
  emit('validate', {
    partita_iva: String(partitaIva.value).replace(/\s/g, ''),
    imponibile: Number(imponibile.value),
    aliquota_iva: Number(aliquotaIva.value),
    totale_dichiarato: Number(totaleDichiarato.value),
  })
}

function fixInputs() {
  // Correct Partita IVA
  if (partitaIva.value) {
    partitaIva.value = correctPiva(partitaIva.value)
  }

  // Recalculate Total
  const imp = Number(imponibile.value) || 0
  const ali = Number(aliquotaIva.value) || 0
  const iva = Math.round(imp * ali) / 100
  totaleDichiarato.value = (imp + iva).toFixed(2)
  
  // Clear error for total if it was there
  if (errors.value.totale_dichiarato) {
    delete errors.value.totale_dichiarato
  }
  if (errors.value.partita_iva) {
    delete errors.value.partita_iva
  }
}

function formatPartitaIvaInput(el) {
  if (!el || !window.$) return
  const $el = window.$(el)
  $el.on('input', function () {
    const v = window.$(this).val().replace(/\D/g, '').slice(0, 11)
    window.$(this).val(v)
  })
}

let partitaIvaUnbind = null

onMounted(() => {
  if (formRef.value && window.$) {
    const input = formRef.value.querySelector('[name="partita_iva"]')
    if (input) {
      formatPartitaIvaInput(input)
      partitaIvaUnbind = () => window.$(input).off('input')
    }
  }
})

onUnmounted(() => {
  if (partitaIvaUnbind) partitaIvaUnbind()
})
</script>

<template>
  <div class="card border-0 shadow-sm mb-5">
    <div class="card-body p-4 p-md-5">
      <form ref="formRef" class="invoice-form" @submit.prevent="submit">
        <div class="form-group mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="mb-0" for="partita_iva">{{ t('form.partita_iva') }}</label>
            <button 
              type="button" 
              class="btn btn-sm btn-outline-primary py-1 px-2" 
              :title="t('form.validate_btn')"
              @click="fixInputs"
              v-if="partitaIva || imponibile"
            >
              <i class="fas fa-calculator mr-1"></i> {{ t('form.validate_btn').split(' ')[0] }}
            </button>
          </div>
          <input
            id="partita_iva"
            v-model="partitaIva"
            name="partita_iva"
            type="text"
            inputmode="numeric"
            maxlength="11"
            :placeholder="t('form.examples.partita_iva')"
            class="form-control"
            :class="{ 'is-invalid': errors.partita_iva }"
            :disabled="loading"
          />
          <span v-if="errors.partita_iva" class="invalid-feedback d-block">{{ errors.partita_iva }}</span>
        </div>
        <div class="form-group">
          <label for="imponibile">{{ t('form.imponibile') }} (€)</label>
          <input
            id="imponibile"
            v-model.number="imponibile"
            name="imponibile"
            type="number"
            step="0.01"
            min="0"
            :placeholder="t('form.examples.imponibile')"
            class="form-control"
            :class="{ 'is-invalid': errors.imponibile }"
            :disabled="loading"
          />
          <span v-if="errors.imponibile" class="invalid-feedback d-block">{{ errors.imponibile }}</span>
        </div>
        <div class="form-group">
          <label for="aliquota_iva">{{ t('form.aliquota_iva') }} (%)</label>
          <input
            id="aliquota_iva"
            v-model="aliquotaIva"
            name="aliquota_iva"
            type="number"
            step="0.01"
            min="0"
            :placeholder="t('form.examples.aliquota_iva')"
            class="form-control"
            :class="{ 'is-invalid': errors.aliquota_iva }"
            :disabled="loading"
          />
          <span v-if="errors.aliquota_iva" class="invalid-feedback d-block">{{ errors.aliquota_iva }}</span>
        </div>
        <div class="form-group">
          <label for="totale_dichiarato">{{ t('form.totale_dichiarato') }} (€)</label>
          <input
            id="totale_dichiarato"
            v-model.number="totaleDichiarato"
            name="totale_dichiarato"
            type="number"
            step="0.01"
            min="0"
            :placeholder="t('form.examples.totale_dichiarato')"
            class="form-control"
            :class="{ 'is-invalid': errors.totale_dichiarato }"
            :disabled="loading"
          />
          <span v-if="errors.totale_dichiarato" class="invalid-feedback d-block">{{ errors.totale_dichiarato }}</span>
        </div>
        <button
          type="submit"
          class="btn btn-primary lift"
          :disabled="loading"
        >
          {{ loading ? t('form.validating_btn') : t('form.validate_btn') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.invoice-form .form-group {
  margin-bottom: 1.25rem;
}
.invoice-form .btn {
  margin-top: 0.25rem;
}
</style>
