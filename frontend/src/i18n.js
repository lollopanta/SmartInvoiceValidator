import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import it from './locales/it.json'

const savedLang = localStorage.getItem('user-lang') || 'en'

const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: savedLang,
    fallbackLocale: 'en',
    messages: {
        en,
        it
    }
})

export default i18n

/**
 * Helper to change language and persist it
 */
export function setLanguage(lang) {
    i18n.global.locale.value = lang
    localStorage.setItem('user-lang', lang)
    document.documentElement.lang = lang
}
