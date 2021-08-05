import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Nav from 'components/common/Nav'
import { COMIC_OVERVIEW_DATA } from 'constants/dummy'

const ProfileDetail = ({ userProfile, accountId }) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${accountId}/collectibles`)
  }, [router.query.id])

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="h-screen" />
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const chapterRes = COMIC_OVERVIEW_DATA
  const chapterInfo = chapterRes.data.results[0] || null
  return {
    props: { chapterInfo, accountId: params.id },
  }
}

export default ProfileDetail
