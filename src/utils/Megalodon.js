import { useStore } from '@/stores/global'
import generator, { detector } from 'megalodon'

class Megalodon {
  static get protocol () {
    return 'https'
  }

  static get appName () {
    return 'enclosure'
  }

  static get scopes () {
    return ['read', 'write', 'follow', 'push']
  }

  static get appUrl () {
    return 'https://github.com/dspangenberg/enclosure'
  }

  static get redirect () {
    return 'http://localhost:3000/auth/autorize'
  }

  async account () {
    if (this._account) return Promise.resolve(this._account)
    const store = useStore()
    this._account = await store.ensureAccount()
    return Promise.resolve(this._account)
  }

  setAccount (account) {
    this._account = account
    this.setDomain(account.domain)
  }

  static async client (account = null, code = null) {
    const instance = new this()
    return instance.client(account, code)
  }

  async client (account = null, code = null) {
    if (account) {
      this.setAccount(account)
    }
    return await this.ensureClient(code)
  }

  setDomain (value) {
    this._domain = value.trim()
    this._baseUrl = `${this.constructor.protocol}://${this._domain}`
  }

  async detectSns () {
    try {
      this._sns = await detector(this._baseUrl)
      return Promise.resolve(this._sns)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async generateClient (code = null, domain = null) {
    if (domain) {
      this.setDomain(domain)
    } else {
      if (!this._domain) {
        const account = await this.account()
        this.setDomain(account.domain)
      }
    }

    const sns = this._sns ? this._sns : await this.detectSns()
    code = code || await this.account().accessToken

    try {
      this._client = generator(sns, this._baseUrl, code, 'enclosure')
      this._code = null
      return Promise.resolve(this._client)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async ensureClient (code = null) {
    const store = useStore()
    if (this._client) return this._client
    if (!this._account) {
      this._account = await store.ensureAccount()
    }
    return await this.generateClient(code)
  }

  static async registerApp (domain) {
    const instance = new this()
    instance.setDomain(domain)
    const client = await instance.generateClient()
    try {
      const res = await client.registerApp(this.appName, {
        website: this.appUrl,
        redirect_uris: this.redirect,
        scopes: this.scopes
      })
      res.sns = instance._sns
      res.baseUrl = instance._baseUrl
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async fetchAccessToken (code = null, account = null) {
    const instance = new this()
    if (account) {
      instance.setAccount(account)
    }
    const client = await instance.generateClient(code, instance._domain)

    try {
      const res = await client.fetchAccessToken(instance._account.clientId, instance._account.clientSecret, code, instance.constructor.redirect)
      instance._account.accessToken = res.accessToken
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async verifyAccountCredentials (code = null) {
    const client = await this.ensureClient(code)
    try {
      const res = await client.verifyAccountCredentials()
      return Promise.resolve(res.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default Megalodon
