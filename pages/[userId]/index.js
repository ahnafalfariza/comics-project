import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Profile from 'components/Profile'
import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import axios from 'axios'

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

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.PARAS_API_URL}/profiles?accountId=${params.userId}`
  )

  return {
    props: {
      profile: response.data.data.results[0],
    },
  }
}

export default ProfilePage
