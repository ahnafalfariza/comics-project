import { forwardRef } from 'react'

import { IconChevron, IconGift, IconMessageCircle } from 'components/Icons'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

const SHOW_SUPPORT = false

const MenuBottom = forwardRef(({ showMenu, data, hasNext }, ref) => {
  const setShowComment = useStore((state) => state.setShowComment)
  const router = useRouter()

  const onClickNextChapter = () => {
    if (hasNext) {
      router.push({
        pathname: `/viewer/${data.comic_id}/${data.chapter_id + 1}`,
      })
    }
  }

  const onClickPrevChapter = () => {
    if (data.chapter_id !== 1) {
      router.push({
        pathname: `/viewer/${data.comic_id}/${data.chapter_id - 1}`,
      })
    }
  }

  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 bottom-0 overflow-hidden transform z-10 transition-transform ease-in-out duration-300 ${
        showMenu ? 'translate-y-0' : 'translate-y-20'
      }`}
    >
      <div className="bg-background relative">
        <div className="flex max-w-xl m-auto p-4 items-center justify-between">
          <div className="flex items-center">
            {SHOW_SUPPORT && (
              <div className="flex items-center cursor-pointer mr-4">
                <IconGift size={20} color="#ffffff" />
                <p className="text-white ml-2 text-sm">Support</p>
              </div>
            )}
            <div
              className="flex items-center cursor-pointer"
              onClick={setShowComment}
            >
              <IconMessageCircle size={20} color="#ffffff" />
              <p className="text-white ml-2 text-sm">Comment</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <IconChevron
              transform="scale(-1,1)"
              color="#ffffff"
              className={`cursor-pointer ${
                data?.chapter_id === 1 ? 'opacity-40' : ''
              }`}
              onClick={onClickPrevChapter}
            />
            <p className="text-white">Ch {data?.chapter_id}</p>
            <IconChevron
              color="#ffffff"
              className={`cursor-pointer ${!hasNext ? 'opacity-40' : ''}`}
              onClick={onClickNextChapter}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
MenuBottom.displayName = 'MenuBottom'

export default MenuBottom
