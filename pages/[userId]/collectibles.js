import { COMIC_COLLECTIBLES_DATA } from 'constants/dummy'
import TokenList from 'components/Token/TokenList'

const { default: Nav } = require('components/Common/Nav')
const { default: Profile } = require('components/Profile')

const ProfilePageCollectibles = () => {
  return (
    <div>
      <Nav />
      <Profile />
      <div className="max-w-5xl m-auto pb-16">
        <TokenList tokens={COMIC_COLLECTIBLES_DATA.results} />
      </div>
    </div>
  )
}

export default ProfilePageCollectibles
