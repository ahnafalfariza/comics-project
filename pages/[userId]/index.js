import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Profile from 'components/Profile'
import Layout from 'components/Layout'
import Head from 'components/Common/Head'

const ProfilePage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${router.query.userId}/comics`)
  }, [router, router.query.userId])

  return (
    <Layout>
      <Head />
      <Profile />
    </Layout>
  )
}

export default ProfilePage
