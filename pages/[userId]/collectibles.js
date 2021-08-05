import CardList from 'components/Chapter/ChapterCollectibles'
import { COMIC_COLLECTIBLES_DATA } from 'constants/dummy'

const { default: Nav } = require('components/Common/Nav')
const { default: Profile } = require('components/Profile')

const ProfilePageCollectibles = () => {
  return (
    <div>
      <Nav />
      <Profile />
      <div className="max-w-5xl m-auto pb-16">
        <CardList tokens={COMIC_COLLECTIBLES_DATA.results} />
      </div>
    </div>
  )
}

export default ProfilePageCollectibles
