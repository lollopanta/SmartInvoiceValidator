<script setup>
import { ref, nextTick } from 'vue'
import InvoiceForm from './components/InvoiceForm.vue'
import ValidationResult from './components/ValidationResult.vue'
import { validateInvoice } from './services/api'

const result = ref(null)
const loading = ref(false)
const resultRef = ref(null)

async function handleValidate(payload) {
  loading.value = true
  result.value = null
  const response = await validateInvoice(payload)
  loading.value = false
  result.value = response
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
</script>

<template>
  <div class="app-wrap">
    <section class="py-6 pb-lg-8">
      <div class="container">
        <header class="text-center mb-6">
          <h1 class="font-weight-bold display-4 mb-2">
            Valida <span class="text-primary">fattura</span>
          </h1>
          <p class="font-size-sm text-main mb-0">
            Verifica i dati prima dell’invio per evitare rigetti dallo SDI.
          </p>
        </header>

        <InvoiceForm
          :loading="loading"
          @validate="handleValidate"
        />

        <ValidationResult
          ref="resultRef"
          :result="result"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.app-wrap {
  min-height: 100vh;
  background-color: #F9FBFD;
}
</style>
