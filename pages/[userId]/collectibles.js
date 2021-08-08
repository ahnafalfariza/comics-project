import Head from 'components/Common/Head'
import TokenList from 'components/Token/TokenList'
import Layout from 'components/Layout'
import Profile from 'components/Profile'

import { COMIC_COLLECTIBLES_DATA } from 'constants/dummy'

const ProfilePageCollectibles = () => {
  return (
    <Layout>
      <Head />
      <Profile />
      <div className="max-w-5xl m-auto pb-16">
        <TokenList tokens={COMIC_COLLECTIBLES_DATA.results} />
      </div>
    </Layout>
  )
}

export default ProfilePageCollectibles
