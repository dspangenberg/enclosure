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
import Vue3Sanitize from 'vue-3-sanitize'
import directives from '@/directives'
import Tooltip from '@/components/Tooltip.vue'
import VueLazyload from 'vue-lazyload'
import mittAsync from '@/utils/MittAsync'

const i18n = createI18n({
  locale: 'de',
  fallbackLocale: ['de', 'en'],
  fallbackFormat: true,
  messages
})

const app = createApp(App)
const components = import.meta.glob('./components/**/*.vue')

Object.entries(components).forEach(([path, component]) => {
  if (path.includes('stormy')) {
    const name = toSnakeCaseWithHyphens(('stormy' + path.split('/').slice(-1)[0].replace('.vue', '')))
    app.component(name, defineAsyncComponent(component))
  }
  if (path.includes('enclosure')) {
    const name = toSnakeCaseWithHyphens(('enclosure' + path.split('/').slice(-1)[0].replace('.vue', '')))
    app.component(name, defineAsyncComponent(component))
  }
})

directives(app)

app.use(createPinia())
app.config.globalProperties.emitter = mittAsync()

app
  .use(i18n)
  .component('Tooltip', Tooltip)
  .use(router)
  .use(VueLazyload)
  .use(Vue3Sanitize, {
    allowedTags: ['a', 'p', 'ul', 'li', 'ol', 'img', 'video']
  })
  .mount('#app')
