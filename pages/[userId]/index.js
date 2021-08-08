import Profile from 'components/Profile'
import Nav from 'components/Common/Nav'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProfilePage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${router.query.userId}/comics`)
  }, [router, router.query.userId])

  return (
    <div>
      <Nav />
      <Profile />
    </div>
  )
}

export default ProfilePage
