
import BaseModel from './lib/BaseModel'

const Account = class extends BaseModel {
  static get getDocType () {
    return 'account'
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
