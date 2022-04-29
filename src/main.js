import '@/assets/index.css'
import '@fontsource/clear-sans'
import 'virtual:svg-icons-register'

import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import { toSnakeCaseWithHyphens } from '@/utils/StringHelper.js'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import router from '@/router'
import { createPinia } from 'pinia'

const i18n = createI18n({
  locale: 'de',
  fallbackLocale: ['de', 'en'],
  fallbackFormat: true,
  messages
})

const app = createApp(App)
const components = import.meta.glob('./components/stormy/*.vue')

Object.entries(components).forEach(([path, component]) => {
  if (path.includes('stormy')) {
    const name = toSnakeCaseWithHyphens(('stormy' + path.split('/').slice(-1)[0].replace('.vue', '')))
    app.component(name, defineAsyncComponent(component))
  }
})

app
  .use(i18n)
  .use(createPinia())
  .use(router)
  .mount('#app')
