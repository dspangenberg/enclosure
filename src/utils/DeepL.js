import axios from 'axios'
import { useStore } from '@/stores/global'

class DeepL {
  static get authKey () {
    const store = useStore()
    const key = store.genEnvVar('VITE_KEY_DEEPL')
    return key
  }

  static async translate (content, targetLang = 'de') {
    try {
      const response = await axios
        .get('https://api-free.deepl.com/v2/translate', {
          params: {
            auth_key: this.authKey,
            text: content,
            target_lang: targetLang
          },
          proxy: {
            host: 'localhost',
            port: 8080
          }
        })

      await this.usage()
      return Promise.resolve({
        translatedText: response.data.translations[0].text,
        sourceLang: response.data.translations[0].detected_source_language
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async usage () {
    const store = useStore()
    try {
      const response2 = await axios
        .get('https://api-free.deepl.com/v2/usage', {
          params: {
            auth_key: this.authKey
          },
          proxy: {
            host: 'localhost',
            port: 8080
          }
        })
      const limit = response2.data.character_limit - response2.data.character_count
      store.setDeepLimit(limit)
      return Promise.resolve(limit)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default DeepL
