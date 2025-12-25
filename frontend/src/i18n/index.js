import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import zhTW from '../locales/zh-TW.json'
import en from '../locales/en.json'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'zh-CN', // Default locale
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en': en
  }
})

export default i18n
