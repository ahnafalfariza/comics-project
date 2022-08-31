import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import Modal from 'components/Common/Modal'
import SocialButton from 'components/Common/SocialButton'
import { IconXCircle } from 'components/Icons'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithCredential,
  signInWithCustomToken,
  signInWithPopup,
  sendSignInLinkToEmail,
} from 'firebase/auth'
import axios from 'axios'
import firebase from 'lib/firebase'
import { useEffect, useState } from 'react'
import Loading from 'components/Common/Loading'
import near from 'lib/near'
import BindSuccess from 'components/Common/BindSuccess'
import BindFailed from 'components/Common/BindFailed'
import { base64urlEncodeWithoutPadding } from '@firebase/util'

const BindModal = ({ show, onClose }) => {
  const [isBinded, setBinded] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessageForLogin, setErrorMessageForLogin] = useState('')
  const [successMessageForLogin, setSuccessMessageForLogin] = useState('')
  const [email, setEmail] = useState('')
  const googleAuthProvider = new GoogleAuthProvider()
  const facebookAuthProvider = new FacebookAuthProvider()
  const twitterAuthProvider = new TwitterAuthProvider()
  const auth = firebase
  useEffect(() => {
    checkBinding()
  }, [isBinded])
  const signInWithParas = async (accessToken) => {
    try {
      const resp = await axios.post(
        `${process.env.COMIC_API_URL}/profiles/link-token`,
        {
          firebase_token: accessToken,
        },
        {
          headers: {
            Authorization: await near.authToken(),
          },
        }
      )
      const parasAccessToken = resp.data.data
      const newAccount = await signInWithCustomToken(auth, parasAccessToken)
      return newAccount
    } catch (e) {
      console.log(e)
    }
  }
  const checkBinding = async () => {
    await near.init()
    try {
      setLoading(true)
      const resp = await axios.get(
        `${process.env.COMIC_API_URL}/profiles/link-check`,
        {
          headers: {
            Authorization: await near.authToken(),
          },
        }
      )
      setLoading(false)
      setBinded(resp.data.data && resp.data.data.link_status)
    } catch (e) {
      setLoading(false)
      setBinded(false)
    }
  }
  const linkAction = async (provider) => {
    try {
      setLoading(true)
      let credential
      let linkedCred
      if (provider == 'google') {
        const resultAuth = await signInWithPopup(auth, googleAuthProvider)
        const credentialGoogle =
          GoogleAuthProvider.credentialFromResult(resultAuth)
        credential = await signInWithCredential(auth, credentialGoogle)
      } else if (provider == 'facebook') {
        const resultAuth = await signInWithPopup(auth, facebookAuthProvider)
        const credentialFacebook =
          FacebookAuthProvider.credentialFromResult(resultAuth)
        credential = await signInWithCredential(auth, credentialFacebook)
      } else if (provider == 'twitter') {
        const resultAuth = await signInWithPopup(auth, twitterAuthProvider)
        const credentialTwit =
          TwitterAuthProvider.credentialFromResult(resultAuth)
        credential = await signInWithCredential(auth, credentialTwit)
      } else {
        await sendSignInLinkToEmail(auth, email, {
          url:
            window.location.protocol +
            '//' +
            window.location.host +
            '/verify?code=' +
            encodeURIComponent(base64urlEncodeWithoutPadding(email)),
          handleCodeInApp: true,
        })
        console.log(email)
      }
      setLoading(false)
      if (provider != 'email') {
        const accessToken = await credential.user.getIdToken()
        linkedCred = await signInWithParas(accessToken)
        checkBinding()
      } else {
        setSuccessMessageForLogin('Link Send. Please Check Your Email!')
      }
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setErrorMessage(
          'This email has not yet registered in Paras Comic Mobile App. Please register on Paras Comic Mobile App first.'
        )
      } else if (e.code != 'auth/user-not-found' && provider == 'email') {
        setErrorMessageForLogin('Invalid Email')
        setErrorMessage('')
      } else {
        setErrorMessage('Unable to bind account. Try again later')
      }
      setLoading(false)
      setBinded(false)
    }
  }
  return (
    <Modal
      isShow={show}
      close={onClose}
      closeOnEscape={false}
      closeOnBgClick={false}
    >
      <div className="max-w-sm m-4 md:m-auto w-full relative bg-gray-50 px-4 py-8 text-center rounded-md shadow-xl">
        {isLoading && (
          <div className="flex-1 bg-background z-50">
            <Loading className="w-full m-auto flex justify-center items-center" />
          </div>
        )}
        {isBinded && (
          <div className="flex items-center flex-col">
            <BindSuccess />
          </div>
        )}
        {errorMessage && !isBinded && (
          <div className="flex items-center flex-col">
            <BindFailed message={errorMessage} />
          </div>
        )}

        {!isBinded && errorMessage === '' && !isLoading && (
          <>
            <h6>
              Use The Same Email With Paras Mobile App <br />
              To Transfer Comic Ownership
            </h6>
            <div className="mt-2">
              <div className="text-red-600">{errorMessageForLogin}</div>
              <div className="text-green-600">{successMessageForLogin}</div>
              <div className="mt-1 text-left">
                <label className="text-gray pb-2 block text-sm font-semibold">
                  Email
                </label>
                <InputText
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="flex flex-row mt-1">
                <Button
                  onClick={() => linkAction('email')}
                  size={'md'}
                  isFullWidth={true}
                  className="self-end"
                  variant="primary"
                >
                  SEND LINK REQUEST
                </Button>
              </div>
            </div>
            <div className="w-full mt-2 text-center text-sm text-gray">OR</div>
            <div className="flex-1 flex-col mt-2">
              <SocialButton
                onClick={() => linkAction('facebook')}
                account="facebook"
                isFullWidth={true}
                className="mt-1"
              ></SocialButton>
              <SocialButton
                onClick={() => linkAction('twitter')}
                account="twitter"
                isFullWidth={true}
                className="mt-1"
              ></SocialButton>
              <SocialButton
                onClick={() => linkAction('google')}
                account="google"
                isFullWidth={true}
                className="mt-1"
              ></SocialButton>
            </div>
          </>
        )}
        <div
          className="absolute -top-4 -right-4 cursor-pointer"
          onClick={onClose}
        >
          <IconXCircle size={32} />
        </div>
      </div>
    </Modal>
  )
}

export default BindModal
