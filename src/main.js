import '@/assets/index.css'
import '@fontsource/clear-sans'
import 'virtual:svg-icons-register'

import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import { toSnakeCaseWithHyphens } from '@/utils/StringHelper.js'

const app = createApp(App)
const components = import.meta.glob('./components/stormy/*.vue')

Object.entries(components).forEach(([path, component]) => {
  if (path.includes('stormy')) {
    const name = toSnakeCaseWithHyphens(('stormy' + path.split('/').slice(-1)[0].replace('.vue', '')))
    app.component(name, defineAsyncComponent(component))
  }
})

app.mount('#app')
