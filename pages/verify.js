import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import { useRouter } from 'next/router'
import firebaseConfig from 'lib/config/firebase'
import { base64Decode } from '@firebase/util'
import { useState, useEffect } from 'react'
import Loading from 'components/Common/Loading'
import firebase from 'lib/firebase'
import {
  signInWithEmailLink,
  signInWithCustomToken,
  signInWithCredential,
} from 'firebase/auth'
import near from 'lib/near'
import axios from 'axios'
import BindSuccess from 'components/Common/BindSuccess'
import BindFailed from 'components/Common/BindFailed'

const VerifyPage = () => {
  const [isBinded, setBinded] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { code, apiKey } = router.query
  const auth = firebase
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
  const linkRequest = async () => {
    await near.init()
    setLoading(true)
    try {
      const email = base64Decode(decodeURIComponent(code))
      if (!email.includes('@')) {
        return false
      }
      const credentialEmailLink = await signInWithEmailLink(auth, email)
      // const credential = await signInWithCredential(auth, credentialEmailLink)
      const accessToken = await credentialEmailLink.user.getIdToken()
      await signInWithParas(accessToken)
      setLoading(false)
      setBinded(true)
    } catch (e) {
      console.log(e)
      if (e.code === 'auth/user-not-found') {
        setErrorMessage(
          'This email has not yet registered in Paras Comic Mobile App. Please register on Paras Comic Mobile App first.'
        )
      } else if (auth.code === 'auth/invalid-action-code') {
        setErrorMessage(
          'Link Expired. Try to get the new one by "SEND LINK REQUEST" ! '
        )
      } else {
        setErrorMessage('Unable to bind account. Try again later')
      }
      setLoading(false)
      setBinded(false)
    }
  }
  useEffect(() => {
    linkRequest()
  }, [code, apiKey])
  return (
    <Layout>
      <Head title="Verify Linked Acccount By Email"></Head>
      <div className="h-full w-full max-w-6xl m-auto relative">
        <div className="h-full w-full flex items-center justify-center">
          {isLoading && (
            <div className="flex-1 bg-background z-50 mt-5">
              <Loading className="w-full m-auto flex justify-center items-center" />
            </div>
          )}
          {isBinded && (
            <div className="flex items-center flex-col">
              <BindSuccess />
            </div>
          )}
          {errorMessage && !isBinded && (
            <div className="flex items-center flex-col mt-5">
              <BindFailed message={errorMessage} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
export default VerifyPage
