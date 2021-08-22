import near from 'lib/near'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { parseImgUrl } from 'utils/common'
import Avatar from './Common/Avatar'
import Button from './Common/Button'
import { Tab, TabList, Tabs } from './Common/Tabs'
import EditProfileModal from './Modal/EditProfileModal'

const Profile = ({ userData, setUserData }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState('')

  const onTabsChange = (idx) => {
    if (idx === 0) {
      router.push(`/${router.query.userId}/comics`)
    } else if (idx === 1) {
      router.push(`/${router.query.userId}/collectibles`)
    }
  }

  const defaultIndex = () => {
    if (router.pathname.includes('comics')) {
      return 0
    } else if (router.pathname.includes('collectibles')) {
      return 1
    }
  }

  return (
    <div>
      {showModal === 'editProfile' && (
        <EditProfileModal
          userData={userData}
          setUserData={setUserData}
          onClose={() => setShowModal('')}
        />
      )}
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
        <img
          src={parseImgUrl(
            'bafybeihjydufqanles3dh7zctbbxaljhduapkmmzk3f55zzebcuj2sn32y'
          )}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="max-w-5xl m-auto px-4">
        <div className="md:flex">
          <Avatar
            size="xxl"
            src={parseImgUrl(userData?.imgUrl || '')}
            className="md:w-64 md:h-64 -mt-12 md:-mt-32 flex-shrink-0 border-8 border-background z-20"
          />
          <div className="w-full md:ml-8 md:mt-4">
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-white text-xl md:text-3xl font-bold">
                  {userData?.accountId}
                </p>
              </div>
              {near.getAccount() &&
                near.getAccount().accountId === userData?.accountId && (
                  <div>
                    <Button
                      onClick={() => setShowModal('editProfile')}
                      size="md"
                      variant="secondary"
                      className={'hidden md:block'}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      onClick={() => setShowModal('editProfile')}
                      size="sm"
                      variant="secondary"
                      className={'block md:hidden'}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
            </div>
            <p className="mt-2 text-white opacity-80">{userData?.bio}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-5xl mx-auto">
        <Tabs onTabsChange={onTabsChange} defaultIndex={defaultIndex()}>
          <TabList>
            <Tab>Comics</Tab>
            <Tab>Collectibles</Tab>
          </TabList>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile
