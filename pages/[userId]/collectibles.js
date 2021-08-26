import Head from 'components/Common/Head'
import Layout from 'components/Layout'
import Profile from 'components/Profile'

import { useState } from 'react'
import axios from 'axios'
import CardList from 'components/Token/CardList'

const ProfilePageCollectibles = ({ profile }) => {
  const [userData, setUserData] = useState(profile)

  return (
    <Layout>
      <Head title={`${profile.accountId} - Comics by Paras`} />
      <Profile userData={userData} setUserData={setUserData} />
      <div className="max-w-5xl m-auto pb-16">
        <CardList tokens={[]} />
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
