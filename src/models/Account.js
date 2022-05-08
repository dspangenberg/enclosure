import BaseModel from '@/models/lib/BaseModel'
import PouchDb from '@/models/lib/PouchDb'
import { useStore } from '@/stores/global'
import { useMegalodon } from '@/composables/useMegalodon.js'

const { registerApp, sns, baseUrl, domain, fetchAccessToken, verifyAccountCredentials, enrichDbAccount } = useMegalodon()

const Account = class extends BaseModel {
  static getDocType () {
    return 'account'
  }

  static async registerApp (mDomain) {
    let mastdonServerUrl = null

    const account = new Account()
    account.isTemp = true
    account.domain = mDomain
    await account.save()

    try {
      const data = await registerApp(mDomain, account.id)
      const { clientId, clientSecret, vapid_key: vapidKey, url, redirect } = data

      mastdonServerUrl = url

      account.sns = sns.value
      account.baseUrl = baseUrl.value
      account.domain = domain.value
      account.clientId = clientId
      account.clientSecret = clientSecret
      account.vapidKey = vapidKey
      account.isTemp = true
      account.redirect = redirect

      await account.save()
      return Promise.resolve({ url: mastdonServerUrl, id: account.id })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async ensureIndices () {
    PouchDb.db().ensureIndices([
      { fields: ['docType', 'accountId', 'domain', 'sns'] }
    ])
  }

  static async verifyAccountCredentials (account = null) {
    const store = useStore()

    if (!account) {
      const accountId = store.getAccountId()
      if (accountId) {
        account = await Account.db().get(accountId)
        if (!account) {
          return Promise.reject(new Error('Keinen aktiven Account gefunden'))
        }
      } else {
        return Promise.reject(new Error('Keinen aktiven Account gefunden'))
      }
    }

    let mastodonAccount
    try {
      mastodonAccount = await verifyAccountCredentials(account)
    } catch (error) {
      return Promise.reject(error)
    }

    if (account.isTemp) {
      const tmpAccountId = account._id
      const accessToken = account.accessToken
      const refreshToken = account.refreshToken
      const lastLoginAt = account.lastLoginAt
      const existingAccount = await Account.db().findOne({
        accountId: mastodonAccount.id,
        sns: mastodonAccount.sns,
        domain: mastodonAccount.domain
      })
      if (existingAccount) {
        account = existingAccount
        account.accessToken = accessToken
        account.refreshToken = refreshToken
        account.lastLoginAt = lastLoginAt
        await PouchDb.db().deleteBy(tmpAccountId)
      } else {
        account.isTemp = false
      }
    }

    account.username = mastodonAccount.username
    account.accountId = mastodonAccount.id
    account.avatar = mastodonAccount.avatar
    account.url = mastodonAccount.url
    account.acct = mastodonAccount.acct
    account.source = mastodonAccount.source
    await account.save()

    store.setAccount(account)
    return Promise.resolve(account)
  }

  static async me () {
    try {
      const store = useStore()
      const accountId = store.getAccountId()
      const account = await Account.db().get(accountId)
      return Promise.resolve(account)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async enrich () {
    try {
      const store = useStore()
      const accountId = store.getAccountId()
      const account = await Account.db().get(accountId)

      console.log(account)

      if (account) {
        const data = await enrichDbAccount(account.accountId)

        account.follower = data.follower
        account.following = data.following
        account.instance = data.instance

        await account.save()
        return Promise.resolve(account)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async autorize (id, code) {
    const store = useStore()
    await Account.ensureIndices()

    const tempAccount = await Account.db().get(id)

    tempAccount.accessToken = code
    tempAccount.save()

    const { domain, clientId, clientSecret, redirect, sns, baseUrl } = tempAccount
    const token = await fetchAccessToken(domain, clientId, clientSecret, code, redirect, sns, baseUrl)

    tempAccount.accessToken = token.access_token
    tempAccount.refreshToken = token.refresh_token || ''
    tempAccount.lastLoginAt = new Date()
    await tempAccount.save()

    store.setAccount(tempAccount)

    const account = await this.verifyAccountCredentials(tempAccount)
    return Promise.resolve(account)
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
      redirect: prop(String),
      data: Object,
      source: Object,
      isTemp: prop(Boolean).value(false),
      lastLoginAt: prop(Date).value(null),
      follower: [String],
      following: [String],
      instance: Object
    }
  }
}

export default Account
