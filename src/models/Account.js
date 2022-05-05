
import BaseModel from './lib/BaseModel'

const Account = class extends BaseModel {
  static getDocType () {
    return 'account'
  }

  eigeneFUnktion () {
    return 'test'
  }

  static get schema () {
    const prop = this.prop

    return {
      baseUrl: prop(String).required(),
      domain: prop(String).required(),
      clientId: prop(String).required(),
      clientSecret: prop(String).required(),
      sns: prop(String),
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
