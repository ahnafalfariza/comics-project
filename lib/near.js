import getConfig from './config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import axios from 'axios'

class Near {
  constructor() {
    this.contract = {}
    this.wallet = {}
    this.currentUser = null
    this.nearConfig = {}
    this.signer = {}
    this.token = null
  }

  async authToken() {
    if (this.currentUser) {
      const accountId = this.currentUser.accountId
      const arr = new Array(accountId)
      for (var i = 0; i < accountId.length; i++) {
        arr[i] = accountId.charCodeAt(i)
      }
      const msgBuf = new Uint8Array(arr)
      const signedMsg = await this.signer.signMessage(
        msgBuf,
        this.wallet._authData.accountId,
        this.wallet._networkId
      )
      const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
      const signature = Buffer.from(signedMsg.signature).toString('hex')
      const payload = [accountId, pubKey, signature]
      this.token = Base64.encode(payload.join('&'))
    }
  }

  async init() {
    const { keyStores, connect, WalletConnection, InMemorySigner } = nearAPI
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
    this.signer = new InMemorySigner(keyStore)
    await this.authToken()
    axios.defaults.headers.common['Authorization'] = this.token
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
