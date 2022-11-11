import BaseModel from '@/models/lib/BaseModel'
import PouchDb from '@/models/lib/PouchDb'
import { useStore } from '@/stores/global'
import { mastoApi } from '@/api'

const Account = class extends BaseModel {
  static getDocType () {
    return 'account'
  }

  static async revokeAccessToken () {
    const store = useStore()
    const account = await store.ensureAccount()

    const { revokeAccessToken } = mastoApi(account.baseUrl, account.accessToken)
    await revokeAccessToken(account)
  }

  static async registerApp (mDomain) {
    const store = useStore()

    const { registerApp } = mastoApi('https://mastodon.social/api/v1')

    let mastdonServerUrl = null

    const account = new Account()
    account.baseUrl = 'https://mastodon.social/api/v1/'
    account.isTemp = true
    account.domain = 'mastodon.social'
    await account.save()

    try {
      const redirectUrl = encodeURI(`${store.genEnvVar('REDIRECT_URL')}/${account.id}`)
      const data = await registerApp('bleep', '', redirectUrl)

      const { clientId, clientSecret, vapidKey, url, redirectUris } = data
      mastdonServerUrl = url

      account.domain = 'mastodon.social'
      account.clientId = clientId
      account.clientSecret = clientSecret
      account.vapidKey = vapidKey
      account.isTemp = true
      account.redirect = redirectUris

      await account.save()
      return Promise.resolve({ url: mastdonServerUrl, id: account.id })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getInstanceInfo () {
    const store = useStore()

    const account = await store.ensureAccount()
    const { getInstance } = mastoApi('https://mastodon.social/api/v2', account.accessToken)
    return await getInstance()
  }

  static async ensureIndices () {
    PouchDb.db().ensureIndices([
      { fields: ['docType', 'mastodonId', 'domain', 'sns'] }
    ])
  }

  static async sync () {
    const account = await this.verifyAccountCredentials()
    const { getFollowers } = mastoApi(account.baseUrl, account.accessToken)
    const followers = []
    let next = true

    while (next) {
      const result = await getFollowers(25)
      next = result.next
      followers.push(...result.data)
    }

    account.followers = followers.map(item => item.id)
    await account.save()
    return account
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
    const { verifyAccountCredentials } = mastoApi(account.baseUrl, account.accessToken)

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
        mastodonId: mastodonAccount.id,
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
    account.mastodonId = mastodonAccount.id
    account.avatar = mastodonAccount.avatar
    account.url = mastodonAccount.url
    account.acct = mastodonAccount.acct
    account.source = mastodonAccount.source
    await account.save()

    store.setAccount(account)
    return Promise.resolve(account)
  }

  static async me (id) {
    try {
      const account = await Account.db().get(id)
      return Promise.resolve(account)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async enrich () {
    /*
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
    */
  }

  static async autorize (id, code) {
    const store = useStore()
    await Account.ensureIndices()

    const { fetchAccessToken } = mastoApi('https://mastodon.social')

    const tempAccount = await Account.db().get(id)

    tempAccount.accessToken = code
    tempAccount.save()

    const { clientId, clientSecret, redirect } = tempAccount
    const token = await fetchAccessToken(code, clientId, clientSecret, redirect)
    tempAccount.accessToken = token.accessToken
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
      mastodonId: prop(String),
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
