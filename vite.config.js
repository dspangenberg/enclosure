import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { VitePWA } from 'vite-plugin-pwa'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  plugins: [
    vue(),
    VitePWA({}),
    vueI18n({
      include: path.resolve(process.cwd(), 'src/locales/**'),
      compositionOnly: true
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'node_modules/@tabler/icons/icons')],
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
              // customize plugin options
                convertColors: {
                  currentColor: true
                }
              }
            }
          },
          {
            name: 'removeAttrs',
            params: {
              attrs: 'stroke-width'
            }
          }
        ]
      },
      symbolId: 'icon-[dir]-[name]'
    })
  ]
})
