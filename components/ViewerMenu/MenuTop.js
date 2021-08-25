import { forwardRef, useState } from 'react'

import { IconArrow, IconShare } from 'components/Icons'
import { useRouter } from 'next/router'
import BuyChapterModal from 'components/Modal/BuyChapterModal'

const MenuTop = forwardRef(({ showMenu, data }, ref) => {
  const router = useRouter()
  const [showShare, setShowShare] = useState(false)

  const onClickBack = () => {
    router.push(`/comics/${router.query.comicId}`)
  }

  const onClickShare = () => {
    setShowShare(!showShare)
  }

  return (
    <>
      <div
        ref={showShare ? null : ref}
        className={`fixed inset-x-0 overflow-hidden transform z-10 transition-transform ease-in-out duration-300 ${
          showMenu ? 'translate-y-0' : '-translate-y-20'
        }`}
      >
        <div className="bg-background relative">
          <div className="flex max-w-xl m-auto p-4 items-center">
            <IconArrow
              size={20}
              transform="scale(-1,1)"
              color="#ffffff"
              className="cursor-pointer"
              onClick={onClickBack}
            />
            <p className="text-white ml-4 flex-1 md:text-base lg:text-lg">
              {data?.metadata.title}
            </p>
            <IconShare
              size={20}
              color="#ffffff"
              className="cursor-pointer"
              onClick={onClickShare}
            />
          </div>
        </div>
      </div>
      <BuyChapterModal
        active={showShare}
        data={data}
        onClose={onClickShare}
        hideActionButton
      />
    </>
  )
})
MenuTop.displayName = 'MenuTop'

export default MenuTop
