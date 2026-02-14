<script setup>
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../i18n'

const { locale } = useI18n()

function toggleLanguage(lang) {
  setLanguage(lang)
}
</script>

<template>
  <div class="lang-switcher">
    <button 
      @click="toggleLanguage('en')" 
      :class="{ active: locale === 'en' }"
      class="btn btn-sm btn-outline-primary"
    >
      EN
    </button>
    <button 
      @click="toggleLanguage('it')" 
      :class="{ active: locale === 'it' }"
      class="btn btn-sm btn-outline-primary ml-2"
    >
      IT
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
}

.btn {
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  border: 2px solid #2C7BE5;
}

.btn.active {
  background-color: #2C7BE5;
  color: #fff;
}

.btn:not(.active) {
  background: transparent;
  color: #2C7BE5;
}

.btn:hover {
  background-color: rgba(44, 123, 229, 0.1);
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
