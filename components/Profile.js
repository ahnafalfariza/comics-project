import { COVER_IMAGE, PROFILE_IMAGE } from 'constants/dummy'
import { Blurhash } from 'react-blurhash'
import Avatar from './Common/Avatar'

const Profile = ({
  username = 'ahnaf.near',
  profileImage = PROFILE_IMAGE,
  bgImage = COVER_IMAGE,
  bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum sem sed diam fringilla, ut efficitur urna congue. Suspendisse in malesuada quam.',
}) => {
  return (
    <div>
      <div>
        <div className="h-40 md:h-72 relative">
          <div className="absolute inset-0 opacity-0">
            <Blurhash
              hash={'UdIzz^~A4=E29vNHs:RkIqRltPxtR+ofs.oK'}
              width="100%"
              height="100%"
              className="absolute top-0"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </div>
          <img src={bgImage} className="object-cover w-full h-full" />
        </div>
        <div className="max-w-5xl m-auto px-4">
          <div className="md:flex">
            <Avatar
              size="xxl"
              src={profileImage}
              className="md:w-64 md:h-64 -mt-12 md:-mt-32 flex-shrink-0 border-8 border-background z-20"
            />
            <div className="md:ml-8 md:mt-4">
              <p className="text-white text-3xl font-bold">{username}</p>
              <p className="mt-2 text-white opacity-80">{bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
