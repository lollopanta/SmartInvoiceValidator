import { createApp } from 'vue'
import $ from 'jquery'
import App from './App.vue'
import './assets/main.css'

window.$ = window.jQuery = $
createApp(App).mount('#app')
