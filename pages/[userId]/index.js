import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Profile from 'components/Profile'
import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import axios from 'axios'

const ProfilePage = ({ profile }) => {
  const router = useRouter()
  const [userData, setUserData] = useState(profile)

  useEffect(() => {
    router.replace(`${router.query.userId}/comics`)
  }, [router, router.query.userId])

  return (
    <Layout>
      <Head title={`${profile.accountId} - Comics by Paras`} />
      <Profile userData={userData} setUserData={setUserData} />
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.PARAS_API_URL}/profiles?accountId=${params.userId}`
  )

  return {
    props: {
      profile: response.data.data.results[0] || {
        accountId: params.userId,
      },
    },
  }
}

export default ProfilePage
