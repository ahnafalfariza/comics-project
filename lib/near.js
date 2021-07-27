import getConfig from './config/near'
import * as nearAPI from 'near-api-js'

class Near {
  constructor() {
    this.contract = {}
    this.wallet = {}
    this.currentUser = null
    this.nearConfig = {}
  }

  async init() {
    const { keyStores, connect, WalletConnection } = nearAPI
    const keyStore = new keyStores.BrowserLocalStorageKeyStore()
    const nearConfig = {
      ...getConfig(process.env.APP_ENV || 'development'),
      keyStore,
    }
    const near = await connect(nearConfig)
    const wallet = new WalletConnection(near)

    let currentUser
    if (wallet.getAccountId()) {
      currentUser = {
        accountId: wallet.getAccountId(),
        balance: await wallet.account().getAccountBalance(),
      }
    }

    const contract = await new nearAPI.Contract(
      wallet.account(),
      nearConfig.contractName,
      {
        // will add more later
        viewMethods: [],
        changeMethods: [],
        sender: wallet.getAccountId(),
      }
    )

    this.wallet = wallet
    this.contract = contract
    this.currentUser = currentUser
    this.nearConfig = nearConfig
  }

  signIn() {
    this.wallet.requestSignIn(this.nearConfig.contractName, 'Paras - Comics')
  }

  signOut() {
    this.wallet.signOut()
    window.location.replace(window.location.origin + window.location.pathname)
  }

  isLoggedIn() {
    return this.wallet.isSignedIn()
  }

  getAccount() {
    return this.currentUser
  }
}

export default new Near()
