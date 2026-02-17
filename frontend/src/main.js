import { createApp } from 'vue'
import $ from 'jquery'
import App from './App.vue'
import './assets/main.css'

import i18n from './i18n'
import router from './router'

window.$ = window.jQuery = $
const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
