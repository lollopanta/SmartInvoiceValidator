<script setup>
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="app-wrap">
    <div class="bg-shape"></div>
    
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-2 sticky-top">
      <div class="container">
        <router-link class="navbar-brand font-weight-bold d-flex align-items-center" to="/">
          <span class="text-primary-gradient mr-1">Smart</span>Validator
        </router-link>
        
        <div class="ml-auto d-flex align-items-center">
          <ul class="navbar-nav mr-4 d-none d-md-flex">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active">{{ t('app.nav.home') || 'Home' }}</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/statistic" active-class="active">{{ t('app.nav.statistics') || 'Statistiche' }}</router-link>
            </li>
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>

    <main class="py-6 content-layer">
      <div class="container main-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.path" v-if="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <footer class="py-4 text-center text-muted font-size-xs opacity-50">
      &copy; 2026 SmartInvoiceValidator. Tutti i diritti riservati.
    </footer>
  </div>
</template>

<style>
/* Global styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.text-primary-gradient {
  background: linear-gradient(135deg, #2C7BE5 0%, #00d97e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.nav-link.active {
  color: #2C7BE5 !important;
  font-weight: 600;
}
</style>

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
