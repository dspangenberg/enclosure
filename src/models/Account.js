import BaseModel from '@/models/lib/BaseModel'
import PouchDb from '@/models/lib/PouchDb'
import Megalodon from '@/utils/Megalodon'
import { useStore } from '@/stores/global'

const Account = class extends BaseModel {
  static getDocType () {
    return 'account'
  }

  static async registerApp (domain) {
    let mastdonServerUrl = null

    try {
      const data = await Megalodon.registerApp(domain)
      const { clientId, clientSecret, url, sns, baseUrl, vapid_key: vapidKey } = data

      mastdonServerUrl = url

      const account = new Account()

      account.sns = sns
      account.baseUrl = baseUrl
      account.domain = domain
      account.clientId = clientId
      account.clientSecret = clientSecret
      account.vapidKey = vapidKey

      await account.save()
      return Promise.resolve({ url: mastdonServerUrl, id: account.id })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getClient (account = null, code = null) {
    const store = useStore()
    let $client = await store.getClient()
    if ($client) {
      return $client
    }
    $client = await Megalodon.client(account, code)
    store.setClient($client)
    return $client
  }

  static async ensureIndices () {
    PouchDb.db().ensureIndices([
      { fields: ['docType', 'baseURL', 'domain', 'clientId', 'clientSecret'] }
    ])
  }

  static async updateMastodonAccountData (id, mastodonAccount = null, token = null) {
    const account = await Account.db().get(id)
    if (account && (mastodonAccount || token)) {
      if (mastodonAccount) {
        account.username = mastodonAccount.username
        account.accountId = mastodonAccount.id
        account.avatar = mastodonAccount.avatar
        account.url = mastodonAccount.url
        account.acct = mastodonAccount.acct
      }

      if (token) {
        account.accessToken = token.accessToken
        account.refreshToken = token.refreshToken || ''
      }

      await account.save()
      const store = useStore()
      store.setAccount(account)
      return Promise.resolve(account)
    }
  }

  static async verifyAccountCredentials (acc) {
    const instance = new this()
    const $client = await instance.getClient(acc, acc.accessToken)
    const res = await $client.verifyAccountCredentials()
    const account = await this.updateMastodonAccountData(acc.id, res.data)
    return { account, $client }
  }

  static async autorize (id, code) {
    await Account.ensureIndices()

    const tempAccount = await Account.db().get(id)
    const token = await Megalodon.fetchAccessToken(code, tempAccount)

    const account = await Account.db().findOne({
      baseURL: tempAccount.baseURL,
      domain: tempAccount.domain,
      clientId: tempAccount.clientId,
      clientSecret: tempAccount.clientSecret
    })

    const currentAccount = account || tempAccount

    const instance = new this()
    const $client = await instance.getClient(currentAccount, token.accessToken)
    const res = await $client.verifyAccountCredentials()

    if (currentAccount._id !== tempAccount._id) {
      await tempAccount.remove(tempAccount)
    }

    const acc = await this.updateMastodonAccountData(currentAccount.id, res.data, token)
    return Promise.resolve(acc)
  }

  static get schema () {
    const prop = this.prop

    return {
      baseUrl: prop(String).required(),
      domain: prop(String).required(),
      clientId: prop(String).required(),
      clientSecret: prop(String).required(),
      sns: prop(String),
      accountId: prop(String),
      vapidKey: prop(String),
      accessToken: prop(String),
      refreshToken: prop(String),
      username: prop(String),
      acct: prop(String),
      url: prop(String),
      avatar: prop(String),
      data: Object,
      lastLogin: prop(Date).value(null)
    }
  }
}

export default Account
