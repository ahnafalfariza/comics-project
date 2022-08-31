import { forwardRef, useState } from 'react'

import { IconChevron, IconGift } from 'components/Icons'

import near from 'lib/near'
import useStore from 'lib/store'

import { useRouter } from 'next/router'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from 'components/Modal/LoginModal'

const SHOW_SUPPORT = false

const MenuBottom = forwardRef(
  (
    { showMenu, data, hasNext, isPreview = false, isLoginModal = false },
    ref
  ) => {
    const buyChapter = useStore((state) => state.buyChapter)
    const [showLogin, setShowLogin] = useState(false)
    const router = useRouter()

    const textRight = () => {
      return data?.status === 'read'
        ? 'Read'
        : data?.price
        ? `${
            data?.price === '0' ? 'Free' : `${formatNearAmount(data?.price)} Ⓝ`
          }`
        : data?.is_non_mintable
        ? 'Sold Out'
        : 'Coming Soon'
    }

    const onBuyChapter = () => {
      if (!near.currentUser) {
        isLoginModal(true)
        return
      }
      buyChapter(data.token_series_id, data.price)
    }

    const onClickNextChapter = () => {
      if (hasNext) {
        router.push({
          pathname: `/viewer/${data.metadata.comic_id}/${
            parseInt(data.metadata.chapter_id) + 1
          }`,
        })
      }
    }

    const onClickPrevChapter = () => {
      if (parseInt(data.metadata.chapter_id) !== 1) {
        router.push({
          pathname: `/viewer/${data.metadata.comic_id}/${
            parseInt(data.metadata.chapter_id) - 1
          }`,
        })
      }
    }

    return (
      <>
        <LoginModal
          title="Login to leave a comment"
          show={showLogin}
          onClose={() => setShowLogin(false)}
        />
        <div
          ref={ref}
          className={`fixed inset-x-0 bottom-0 overflow-hidden transform z-10 transition-transform ease-in-out duration-300 border-t-2 ${
            showMenu ? 'translate-y-0' : 'translate-y-20'
          }`}
        >
          <div className="bg-white relative">
            <div className="flex max-w-xl m-auto p-2 items-center justify-between">
              {!isPreview ? (
                <>
                  <div className="flex items-center">
                    {SHOW_SUPPORT && (
                      <div className="flex items-center cursor-pointer mr-4">
                        <IconGift size={20} color="#ffffff" />
                        <p className="text-black ml-2 text-sm">Support</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconChevron
                      color="#ffffff"
                      className={`cursor-pointer transform rotate-180 ${
                        parseInt(data?.metadata.chapter_id) === 1
                          ? 'opacity-40'
                          : ''
                      }`}
                      onClick={onClickPrevChapter}
                    />
                    <p className="text-black">
                      Ch {parseInt(data?.metadata.chapter_id)}
                    </p>
                    <IconChevron
                      color="#ffffff"
                      className={`cursor-pointer ${
                        !hasNext ? 'opacity-40' : ''
                      }`}
                      onClick={onClickNextChapter}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="pr-4 text-gray-400">Preview Mode</p>
                  <h4
                    className="text-sm font-semibold bg-primary rounded-full uppercase tracking-wider leading-none px-5 py-3 text-white cursor-pointer"
                    onClick={onBuyChapter}
                  >
                    {textRight()}
                  </h4>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
)
MenuBottom.displayName = 'MenuBottom'

export default MenuBottom
