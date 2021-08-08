import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import Profile from 'components/Profile'
import ChapterListProfile from 'components/Chapter/ChapterListProfile'

const ProfilePageComics = () => {
  return (
    <Layout>
      <Head />
      <Profile />
      <ChapterListProfile />
    </Layout>
  )
}

export default ProfilePageComics
