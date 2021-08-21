import Head from 'components/Common/Head'
import TokenList from 'components/Token/TokenList'
import Layout from 'components/Layout'
import Profile from 'components/Profile'

import { useState } from 'react'
import axios from 'axios'

const ProfilePageCollectibles = ({ profile }) => {
  const [userData, setUserData] = useState(profile)

  return (
    <Layout>
      <Head />
      <Profile userData={userData} setUserData={setUserData} />
      <div className="max-w-5xl m-auto pb-16">
        <TokenList tokens={[]} />
      </div>
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

export default ProfilePageCollectibles
